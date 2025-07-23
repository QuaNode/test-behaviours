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

  draftData = signal<DraftData>({}); // تخزين المسودات
  currentParams = signal<any>({}); // القيم الحالية للمعلمات

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
        return 'text-success'; // أخضر
      case 'post':
        return 'text-primary'; // أزرق
      case 'put':
        return 'text-warning'; // أصفر
      case 'patch':
        return 'text-info'; // سماوي
      case 'delete':
        return 'text-danger'; // أحمر
      default:
        return 'text-secondary'; // رمادي
    }
  });

  // Get The Main Requests
  constructor() {
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
  }

  setRequest(data: BehavioursResponse) {
    this.request.set(data as Request);
  }
}
