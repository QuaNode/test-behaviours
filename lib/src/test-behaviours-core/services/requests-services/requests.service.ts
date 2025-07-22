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

  generatePostmanCollection() {
  const current = this.requests() ?? [];
console.log('All Requests:', current);
  const filtered = current.filter((def) => def.name !== 'behaviours');

  // Sample default values per parameter key
  const sampleValues: Record<string, string> = {
    email: 'user@example.com',
    password: 'secret123',
    firstName: 'Mahmoud',
    lastName: 'Rabea',
    mobile: '0123456789',
    token: 'test-token',
    'X-Access-Token': 'test-token',
    userId: '123',
    active: 'true'
  };

  const items = filtered.map((def) => {
    const method = def.method || 'GET';
    let path = def.path || '';
    const prefix = def.prefix || '';
    const url = `${prefix}${path}`;

    const headers: any[] = [];
    const bodyParams: Record<string, any> = {};
    const queryParams: any[] = [];
    const pathParams: string[] = [];

    // Handle parameters
    for (const [key, param] of Object.entries(def.parameters ?? {}) as [
      string,
      { key: string; type: string }
    ][]) {
      const sampleValue = sampleValues[param.key] ?? `{{${param.key}}}`;

      switch (param.type) {
        case 'header':
          headers.push({ key: param.key, value: sampleValue, type: 'text' });
          break;
        case 'body':
          bodyParams[param.key] = sampleValue;
          break;
        case 'query':
          queryParams.push({ key: param.key, value: sampleValue });
          break;
        case 'path':
          // Replace path param like :userId with sample value
          path = path.replace(`:${param.key}`, sampleValue);
          break;
      }
    }

    const request: any = {
      method: method.toUpperCase(),
      header: headers,
      url: {
        raw: `http://localhost:8282${path}${queryParams.length ? '?' + queryParams.map(p => `${p.key}=${p.value}`).join('&') : ''}`,
        host: ['localhost'],
        port: '8282',
        path: path.replace(/^\//, '').split('/'),
        query: queryParams.length ? queryParams : undefined
      }
    };

    if (Object.keys(bodyParams).length && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      request.body = {
        mode: 'raw',
        raw: JSON.stringify(bodyParams, null, 2),
        options: { raw: { language: 'json' } }
      };
    }

    return {
      name: def.name,
      request
    };
  });

  return {
    info: {
      name: 'Converted API Collection',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: items
  };
}


  // Ameen Integration

  // isSendEnabled(): boolean {
  //   return this.parameters.controls.some(
  //     (control) => control.get('value')?.value
  //   );
  // }
}
