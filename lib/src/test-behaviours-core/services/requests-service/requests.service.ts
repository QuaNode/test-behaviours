import { Injectable, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BehavioursResponse, Request } from '../../models/collection';
import { Behaviours } from 'ng-behaviours';

export interface AppBehaviours extends Behaviours {
  behaviours(parameters: any): any;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService implements OnDestroy {
  private subscription = new Subscription();

  private requests = new BehaviorSubject<BehavioursResponse[] | null>(null);
  private request = new BehaviorSubject<Request>({
    name: '',
    version: '',
    method: '',
    path: '',
    prefix: '',
    events: false,
  });

<<<<<<< HEAD:lib/src/test-behaviours-core/services/requests-services/requests.service.ts
  draftData = new BehaviorSubject<any>({}); 
  currentParams = new BehaviorSubject<any>({});
=======
  draftData = signal<any>({});
  currentParams = signal<any>({});
>>>>>>> origin/mahmoudrabea:lib/src/test-behaviours-core/services/requests-service/requests.service.ts

  readonly theRequests = this.requests.asObservable();
  readonly theRequest = this.request.asObservable();

  get currentRequest() {
    return this.request.value;
  }

  get currentRequests() {
    return this.requests.value;
  }

  get isValidData(): boolean {
    const currentRequest = this.request.value;
    return !!(
      currentRequest.parameters ||
      currentRequest.returns ||
      currentRequest.name
    );
  }

  get getMethodClass(): string {
    const currentRequest = this.request.value;
    switch (currentRequest.method.toLowerCase()) {
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
            console.error('Error fetching behaviours:', err);
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
<<<<<<< HEAD:lib/src/test-behaviours-core/services/requests-services/requests.service.ts
    this.request.next(data as Request);
    // console.log('Request Set:', this.request());
  }

  setParameterValuesForRequest(
    requestName: string,
    values: Record<string, any>
  ) {
    const prev = this.requests.value;
    if (!prev) return;

    const updated = prev.map((def: BehavioursResponse) => {
      if (def.name !== requestName) return def;

      const updatedParams: any = {};
      for (const key in def.parameters) {
        updatedParams[key] = {
          ...def.parameters[key],
          value: values[key] ?? '',
        };
      }

      return {
        ...def,
        parameters: updatedParams,
      };
    });

    this.requests.next(updated);
  }

  updateRequestParametersWithDraft(apiName: string): void {
    const currentRequest = this.request.value;
    if (currentRequest.parameters) {
      const updatedParameters = { ...currentRequest.parameters };
      const draft = this.draftData.value[apiName]?.parameters || {};
=======
    this.request.set(data as Request);
  }


  updateRequestParameters(apiName: string): void {
    const currentRequest = this.request();
    if (currentRequest.parameters) {
      const currentParameters = currentRequest.parameters;
      const draft = this.draftData()[apiName]?.parameters || {};
>>>>>>> origin/mahmoudrabea:lib/src/test-behaviours-core/services/requests-service/requests.service.ts

      for (const paramName in currentRequest.parameters) {
        const currentParameter = currentParameters[paramName];
        const draftParameter = draft[paramName];
        if (draftParameter !== undefined) {
          currentParameter.value = draftParameter;
        }
      }
<<<<<<< HEAD:lib/src/test-behaviours-core/services/requests-services/requests.service.ts

      // original data
      this.request.next({
        ...currentRequest,
        parameters: updatedParameters,
      });
=======
>>>>>>> origin/mahmoudrabea:lib/src/test-behaviours-core/services/requests-service/requests.service.ts
    }
  }

  updateDraftParam(apiName: string, paramName: string, value: any): void {
    const currentDrafts = this.draftData.value || {};
    const draft = currentDrafts[apiName] || { name: apiName, parameters: {} };

    const updatedParameters = {
      ...draft.parameters,
      [paramName]: value,
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
    return draft?.parameters?.[paramName] || '';
  }
}
