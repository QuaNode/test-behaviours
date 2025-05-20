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

  public readonly theRequests = computed(() => this.requests());
  public readonly theRequest = computed(() => this.request());

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
  }

  isValidData = computed(() => {
    return !!(
      this.request().parameters ||
      this.request().returns ||
      this.request().name
    );
  });
}
