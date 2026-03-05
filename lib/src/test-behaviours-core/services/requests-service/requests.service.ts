import {
  Injectable,
  signal,
  effect,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { BehavioursResponse, Request } from '../../models/collection';
import { Behaviours } from 'ng-behaviours';

export interface AppBehaviours extends Behaviours {
  behaviours(parameters: any): any;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private behaviours = inject(Behaviours) as AppBehaviours;
  private destroyRef = inject(DestroyRef);
  private requests = signal<BehavioursResponse[] | null>(null);
  private request = signal<Request>({
    name: '',
    version: '',
    method: '',
    path: '',
    prefix: '',
    events: false,
  });

  draftData = signal<any>({});
  loadingSignal = signal<boolean>(false);
  currentParams = signal<any>({});

  readonly theRequests = computed(() => this.requests());
  readonly theRequest = computed(() => this.request());

  isValidData = computed(() => {
    return !!(
      this.request().parameters ||
      this.request().returns ||
      this.request().name
    );
  });

  getMethodClass = computed(() => {
    switch (this.request().method.toLowerCase()) {
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
  });

  constructor() {
    const savedDraftData = localStorage.getItem('draftData');
    if (savedDraftData) {
      this.draftData.set(JSON.parse(savedDraftData));
    }

    effect(() => {
      if (!this.requests()) {
        this.behaviours.ready(() => {
          const subscription = this.behaviours.behaviours({}).subscribe({
            next: (res: any) => {
              this.requests.set(
                Object.keys(res || {}).map((name) => ({
                  name,
                  ...res[name],
                }))
              );
            },
            error: () => {
              this.requests.set([]);
            },
          });

          this.destroyRef.onDestroy(() => {
            subscription.unsubscribe();
          });
        });
      }
    });

    effect(() => {
      const currentDraftData = this.draftData();
      localStorage.setItem('draftData', JSON.stringify(currentDraftData));
    });
  }

  setRequest(data: BehavioursResponse) {
    this.request.set(data as Request);
  }

  updateRequestParameters(apiName: string): void {
    const currentRequest = this.request();
    if (currentRequest.parameters) {
      const currentParameters = currentRequest.parameters;
      const draft = this.draftData()[apiName]?.parameters || {};

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
    const currentDrafts = this.draftData() || {};
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
        ...draft,
        parameters: updatedParameters,
      },
    };

    this.draftData.set(updatedDrafts);
  }

  getDraftParam(apiName: string, paramName: string): any {
    const draft = this.draftData()[apiName];
    const paramData = draft?.parameters?.[paramName];

    if (paramData && typeof paramData === 'object' && 'value' in paramData) {
      return paramData.value;
    }

    return paramData || '';
  }

  getDraftParamType(apiName: string, paramName: string): string {
    const draft = this.draftData()[apiName];
    const paramData = draft?.parameters?.[paramName];

    if (paramData && typeof paramData === 'object' && 'type' in paramData) {
      return paramData.type;
    }

    return 'String';
  }

  cacheResponse(apiName: string, response: any, error: any = null, responseTime: number = 0): void {
    const currentData = this.draftData() || {};
    this.draftData.set({
      ...currentData,
      [apiName]: {
        ...currentData[apiName],
        response,
        error,
        responseTime,
      }
    });
  }

  getCachedResponse(apiName: string): any {
    return this.draftData()?.[apiName]?.response;
  }

  getCachedError(apiName: string): any {
    return this.draftData()?.[apiName]?.error;
  }

  getCachedResponseTime(apiName: string): number | null {
    return this.draftData()?.[apiName]?.responseTime || null;
  }

  hasCachedResponse(apiName: string): boolean {
    return !!this.draftData()?.[apiName]?.response;
  }

  clearCache(apiName?: string): void {
    if (apiName) {
      const currentData = { ...this.draftData() };
      delete currentData[apiName];
      this.draftData.set(currentData);
    } else {
      this.draftData.set({});
    }
    localStorage.setItem('draftData', JSON.stringify(this.draftData()));
  }

  setLoadingState(state: boolean): void {
    this.loadingSignal.set(state);
  }


  clearAll(): void {
    localStorage.clear();
    this.draftData.set({});
    this.clearCache();

    this.currentParams.set({});
    this.loadingSignal.set(false);

    this.clearSignal.update((v) => v + 1);
  }

  public clearSignal = signal<number>(0);

  triggerReset(): void { }
}
