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
  private parametersSignal = signal<any>(null);
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

  readonly theRequests = computed(() => this.requests());
  readonly theRequest = computed(() => this.request());

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

  setRequest(data: BehavioursResponse) {
    this.request.set(data as Request);
    // console.log('Request Set:', this.request());
  }

  setParameterValues(values: Record<string, any>) {
  this.request.update((prev) => {
    const updatedParams: any = {};

    for (const key in prev.parameters) {
      updatedParams[key] = {
        ...prev.parameters[key],
        value: values[key] ?? '',
      };
    }

    return {
      ...prev,
      parameters: updatedParams,
    };
  });

  console.log('Request Parameters Updated from IntegrationService:', this.request());
}


  isValidData = computed(() => {
    return !!(
      this.request().parameters ||
      this.request().returns ||
      this.request().name
    );
  });

  // Martina

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


}
