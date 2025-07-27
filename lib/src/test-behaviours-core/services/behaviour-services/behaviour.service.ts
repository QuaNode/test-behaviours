import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-services/requests.service';

@Injectable({
  providedIn: 'root',
})
export class BehaviorService {
  private behaviours = inject(Behaviours);
  private parametersSignal = signal<any>(null);
  private requestsService = inject(RequestsService);
  responseSignal = signal<any>({});

  loadingSignal = signal<boolean>(false);
  errorSignal = signal<any>(null);
  responseTimeSignal = signal<number | null>(null);

  updateParameters(params: any) {
    this.parametersSignal.set(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal();
    return params && Object.keys(params).length > 0;
  }

  updateResponse(response: any) {
    this.responseSignal.set(response);
  }

  downloadJSON(data: any, fileName: string = 'response.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  private send(requestData: any, onSuccess?: (res: any) => void) {
    const params = this.parameters;
    if (!params) return;

    const startTime = performance.now();

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.behaviours
      .getBehaviour(requestData.name)(params)
      .subscribe(
        (response: any) => {
          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);

          this.responseTimeSignal.set(delay);

          this.requestsService.updateRequestParametersWithDraft(
            requestData.name
          );

          this.updateResponse(response);
          this.loadingSignal.set(false);

          // mahmoud
          this.requestsService.setParameterValuesForRequest(
            requestData.name,
            params
          );

          if (onSuccess) {
            onSuccess(response);
          }
        },
        (error: any) => {
          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);
          this.responseTimeSignal.set(delay);

          const formattedError = {
            message: error.message,
          };
          this.updateResponse(formattedError);
          this.errorSignal.set(error);
          this.loadingSignal.set(false);
        }
      );
  }

  sendOnly(requestData: any) {
    this.send(requestData);
  }

  sendAndDownload(requestData: any) {
    this.send(requestData, (response) =>
      this.downloadJSON(`response, ${requestData.name}_response.json`)
    );
  }

  get parameters() {
    return this.parametersSignal();
  }

  generatePostmanCollection(): any {
    const requests = this.requestsService.theRequests();

    const behaviourDefs = (requests ?? [])
      .filter((def) => def.name !== 'behaviours')
      .map((def: any) => {
        const method = def.method || 'GET';
        let path = def.path || '';
        const prefix = def.prefix || '';

        const headers: any[] = [];
        const bodyParams: Record<string, any> = {};
        const queryParams: any[] = [];

        for (const [key, param] of Object.entries(def.parameters ?? {})) {
          const paramKey = (param as any).key ?? key;
          const paramType = (param as any).type;
          const paramValue = (param as any).value ?? `{{${paramKey}}}`;

          switch (paramType) {
            case 'header':
              headers.push({
                key: paramKey,
                value:
                  (param as any).value !== undefined &&
                  (param as any).value !== ''
                    ? (param as any).value
                    : `{{${paramKey}}}`,
                type: 'text',
              });
              break;

            case 'body':
              bodyParams[paramKey] = paramValue;
              break;
            case 'query':
              queryParams.push({ key: paramKey, value: paramValue });
              break;
            case 'path':
              path = path.replace(`:${paramKey}`, paramValue);
              break;
            default:
              break;
          }
        }

        const request: any = {
          method: method.toUpperCase(),
          header: headers,
          url: {
            raw: `http://localhost:8282${prefix}${path}${
              queryParams.length
                ? '?' + queryParams.map((p) => `${p.key}=${p.value}`).join('&')
                : ''
            }`,
            host: ['localhost'],
            port: '8282',
            path: `${prefix}${path}`.replace(/^\//, '').split('/'),
            query: queryParams.length ? queryParams : undefined,
          },
        };

        if (
          Object.keys(bodyParams).length &&
          ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())
        ) {
          request.body = {
            mode: 'raw',
            raw: JSON.stringify(bodyParams, null, 2),
            options: { raw: { language: 'json' } },
          };
        }

        return {
          name: def.name,
          request,
        };
      });

    return {
      info: {
        name: 'Behaviours',
        schema:
          'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: behaviourDefs,
    };
  }
}
