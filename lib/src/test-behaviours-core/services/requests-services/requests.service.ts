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

  draftData = signal<any>({}); // تخزين المسودات
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
    localStorage.clear();

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
            error: (err: Error) => {
              console.error('Error fetching behaviours:', err);
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

  updateRequestParametersWithDraft(apiName: string): void {
    const currentRequest = this.request();
    if (currentRequest.parameters) {
      const updatedParameters = { ...currentRequest.parameters };
      const draft = this.draftData()[apiName]?.parameters || {};

      for (const paramName in updatedParameters) {
        if (draft[paramName] !== undefined) {
          updatedParameters[paramName] = {
            ...updatedParameters[paramName],
            value: draft[paramName],
          };
        }
      }

      // original data
      this.request.update((req) => ({
        ...req,
        parameters: updatedParameters,
      }));
    }
  }

  updateDraftParam(apiName: string, paramName: string, value: any): void {
    const currentDrafts = this.draftData() || {};
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

    this.draftData.set(updatedDrafts);
  }

  getDraftParam(apiName: string, paramName: string): any {
    const draft = this.draftData()[apiName];
    return draft?.parameters?.[paramName] || '';
  }
}
