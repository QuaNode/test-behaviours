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
import { IntegrationService } from '../integration-services/integration.service';

export interface AppBehaviours extends Behaviours {
  behaviours(parameters: any): any;
}

interface DraftData {
  [apiName: string]: {
    name: string;
    parameters: any[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private behaviours = inject(Behaviours) as AppBehaviours;
  private integrationService = inject(IntegrationService);
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
<<<<<<< Updated upstream
  currentParams = signal<any>({}); // القيم الحالية للمعلمات
=======
  currentParams = signal<any>({});
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    // مسح localStorage عند بدء التشغيل
=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    // مراقبة التغييرات في draftData وتخزينها في localStorage
=======
>>>>>>> Stashed changes
    effect(() => {
      const currentDraftData = this.draftData();
      localStorage.setItem('draftData', JSON.stringify(currentDraftData));
    });
<<<<<<< Updated upstream
  }
  onFormChange(updatedFields: Record<string, any>) {
    const apiName = this.request().name;
    const currentDrafts = this.draftData() || {};
    const draft = currentDrafts[apiName] || { name: apiName, parameters: [] };

    const updatedParameters = draft.parameters.map((param: any) => {
      const newValue = updatedFields[param.name];
      return newValue !== undefined ? { ...param, value: newValue } : param;
    });

    for (const key in updatedFields) {
      if (!updatedParameters.find((p: any) => p.name === key)) {
        updatedParameters.push({ name: key, value: updatedFields[key] });
      }
    }

    const updatedDrafts = {
      ...currentDrafts,
      [apiName]: {
        name: apiName,
        parameters: updatedParameters,
      },
    };

    this.draftData.set(updatedDrafts);
    console.log(this.draftData());
    this.currentParams.set(updatedFields); // تحديث القيم الحالية برضو
=======
>>>>>>> Stashed changes
  }

  setRequest(data: BehavioursResponse) {
    this.request.set(data as Request);
  }

<<<<<<< Updated upstream
  // دالة لتحديث parameters بقيم draftData
=======
>>>>>>> Stashed changes
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

      this.request.update((req) => ({
        ...req,
        parameters: updatedParameters,
      }));

<<<<<<< Updated upstream
      console.log(this.request());
    }
  }

  // دالة لتحديث قيمة معينة في draftData
=======
      console.log(this.theRequest());
    }
  }

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // دالة للحصول على قيمة معينة من draftData
=======
>>>>>>> Stashed changes
  getDraftParam(apiName: string, paramName: string): any {
    const draft = this.draftData()[apiName];
    return draft?.parameters?.[paramName] || '';
  }
}
