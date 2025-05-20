
import { Inject, Injectable, signal, effect } from '@angular/core';
import { BehavioursResponse, Request } from '../../models/collection';
import { Behaviours } from 'ng-behaviours';

export interface AppBehaviours extends Behaviours {
  behaviours(parameters: any): any;
}

@Injectable({
  providedIn: 'root',
})

export class RequestsService {
  private static requests = signal<BehavioursResponse[] | null>(null);

  private static request = signal<Request>({
    name: '',
    version: '',
    method: '',
    path: '',
    prefix: '',
    events: true,
  });

  constructor(@Inject(Behaviours) private behaviours: AppBehaviours) {
    if (!RequestsService.requests())
      effect(() => {
        this.behaviours.ready(() => {
          this.behaviours.behaviours({}).subscribe((res: any) => {
            RequestsService.requests.set(
              Object.keys(res || {}).map((name) => {
                return { name, ...res[name] };
              })
            );
          });
        });
      });
  }

  theRequests = RequestsService.requests.asReadonly();

  theRequest = RequestsService.request.asReadonly();

  setRequest(data: BehavioursResponse) {
    RequestsService.request.set(data as Request);
  }
}
