import { Injectable, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Behaviours } from 'ng-behaviours';

export interface AppBehaviours extends Behaviours {
  behaviours(parameters: any): any;
}

export interface Request {
  name: string;
  method: string;
  parameters: any;
  path?: string;
  version?: string;
  prefix?: string;
  events?: boolean;
}

export interface BehavioursResponse {
  name: string;
  method: string;
  parameters: any;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService implements OnDestroy {
  private subscription = new Subscription();

  private requests = new BehaviorSubject<BehavioursResponse[] | null>(null);
  private request = new BehaviorSubject<Request>({
    name: '',
    method: '',
    parameters: {},
  });

  draftData = new BehaviorSubject<any>({});
  currentParams = new BehaviorSubject<any>({});

  readonly theRequests = this.requests.asObservable();
  readonly theRequest = this.request.asObservable();

  get currentRequest() {
    return this.request.value;
  }

  get currentRequests() {
    return this.requests.value;
  }

  get isValidData(): boolean {
    return this.requests.value !== null && this.requests.value.length > 0;
  }

  get getMethodClass(): string {
    const method = this.request.value?.method?.toLowerCase();
    switch (method) {
      case 'get':
        return 'text-success';
      case 'post':
        return 'text-primary';
      case 'put':
        return 'text-warning';
      case 'patch':
        return 'text-info';
      case 'delete':
        return 'text-danger';
      default:
        return 'text-secondary';
    }
  }

  constructor(@Inject(Behaviours) private behaviours: AppBehaviours) {
    localStorage.clear();

    const savedDraftData = localStorage.getItem('draftData');
    if (savedDraftData) {
      this.draftData.next(JSON.parse(savedDraftData));
    }

    if (!this.requests.value) {
      this.behaviours.ready(() => {
        const subscription = this.behaviours.behaviours({}).subscribe({
          next: (res: any) => {
            this.requests.next(
              Object.keys(res || {}).map((name) => ({
                name,
                ...res[name],
              }))
            );
          },
          error: (err: Error) => {
            this.requests.next([]);
          },
        });

        this.subscription.add(subscription);
      });
    }

    // Watch for draft data changes
    this.subscription.add(
      this.draftData.subscribe((currentDraftData) => {
        localStorage.setItem('draftData', JSON.stringify(currentDraftData));
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setRequest(data: BehavioursResponse) {
    this.request.next(data as Request);
  }

  updateRequestParameters(apiName: string): void {
    const currentRequest = this.request.value;
    if (currentRequest.parameters) {
      const currentParameters = currentRequest.parameters;
      const draft = this.draftData.value[apiName]?.parameters || {};

      for (const paramName in currentRequest.parameters) {
        const currentParameter = currentParameters[paramName];
        const draftParameter = draft[paramName];
        if (draftParameter !== undefined) {
          currentParameter.value = draftParameter;
        }
      }
    }
  }

  updateDraftParam(
    apiName: string,
    paramName: string,
    value: any,
    type?: string
  ): void {
    const currentDrafts = this.draftData.value || {};
    const draft = currentDrafts[apiName] || { name: apiName, parameters: {} };

    const updatedParameters = {
      ...draft.parameters,
      [paramName]: {
        value: value,
        type: type || 'String',
      },
    };

    const updatedDrafts = {
      ...currentDrafts,
      [apiName]: {
        name: apiName,
        parameters: updatedParameters,
      },
    };

    this.draftData.next(updatedDrafts);
  }

  getDraftParam(apiName: string, paramName: string): any {
    const draft = this.draftData.value[apiName];
    const paramData = draft?.parameters?.[paramName];

    // Handle both old format (just value) and new format (object with value and type)
    if (paramData && typeof paramData === 'object' && 'value' in paramData) {
      return paramData.value;
    }

    return paramData || '';
  }

  getDraftParamType(apiName: string, paramName: string): string {
    const draft = this.draftData.value[apiName];
    const paramData = draft?.parameters?.[paramName];

    // Handle both old format (just value) and new format (object with value and type)
    if (paramData && typeof paramData === 'object' && 'type' in paramData) {
      return paramData.type;
    }

    return 'String';
  }
}
