import { inject, Injectable } from '@angular/core';
import { RequestsService } from '../requests-service/requests.service';
import { TEST_BEHAVIOURS_UI_CONFIG } from '../../../test-behaviours-ui/config/test-behaviours-ui-config';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private requestsService = inject(RequestsService);
  private config = inject(TEST_BEHAVIOURS_UI_CONFIG);

  exportPostmanCollection(): void {
    const collection = this.generatePostmanCollection();
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    this.triggerDownload(url, 'Behaviours.json');
  }

  triggerDownload(blobUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  generatePostmanCollection(): any {
    const requests = this.requestsService.theRequests();

    const items = (requests ?? [])
      .filter(def => def.name !== 'behaviours')
      .map(def => ({
        name: def.name,
        request: this.buildRequest(def),
      }));

    return {
      info: {
        name: 'Behaviours',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: items,
    };
  }

  private buildRequest(def: any): any {
    const method = def.method?.toUpperCase() || 'GET';
    let path = def.path || '';
    const parameters = def.parameters ?? {};

    const base = this.config.baseURL || window.location.origin;
    const queryParams = this.buildQueryParams(parameters);
    const headers = this.buildHeaders(parameters);
    const bodyParams = this.buildBodyParams(parameters);
    path = this.replacePathParams(path, parameters);

    const url = this.buildUrl(base, this.config.prefix, path, queryParams);

    const request: any = {
      method,
      header: headers,
      url,
    };

    if (Object.keys(bodyParams).length && ['POST', 'PUT', 'PATCH'].includes(method)) {
      request.body = {
        mode: 'raw',
        raw: JSON.stringify(bodyParams, null, 2),
        options: { raw: { language: 'json' } },
      };
    }

    return request;
  }

  private buildUrl(baseURL: string = '', prefix: string = '', path: string, queryParams: any[]): any {

    const queryString = queryParams.length
      ? '?' + queryParams.map(p => `${p.key}=${p.value}`).join('&')
      : '';

    const fullUrl = new URL(prefix, baseURL);
    const host = fullUrl.host;
    const port = fullUrl.port;

    return {
      raw: fullUrl.href,
      host: host,
      port: port,
      path: path,
      query: queryParams.length ? queryParams : undefined,
    };
  }

  private buildHeaders(parameters: any): any[] {
    const headers: any[] = [];

    for (const [key, param] of Object.entries(parameters)) {
      const paramKey = (param as any).key ?? key;
      const paramType = (param as any).type;
      const paramValue = (param as any).value ?? `{{${paramKey}}}`;

      if (paramType === 'header') {
        headers.push({ key: paramKey, value: paramValue, type: 'text' });
      }
    }

    return headers;
  }

  private buildQueryParams(parameters: any): any[] {
    const queryParams: any[] = [];

    for (const [key, param] of Object.entries(parameters)) {
      const paramKey = (param as any).key ?? key;
      const paramType = (param as any).type;
      const paramValue = (param as any).value ?? `{{${paramKey}}}`;

      if (paramType === 'query') {
        queryParams.push({ key: paramKey, value: paramValue });
      }
    }

    return queryParams;
  }

  private buildBodyParams(parameters: any): Record<string, any> {
    const bodyParams: Record<string, any> = {};

    for (const [key, param] of Object.entries(parameters)) {
      const paramKey = (param as any).key ?? key;
      const paramType = (param as any).type;
      const paramValue = (param as any).value ?? `{{${paramKey}}}`;

      if (paramType === 'body') {
        const parts = paramKey.split('.');
        let ref = bodyParams;

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (i === parts.length - 1) {
            ref[part] = paramValue;
          } else {
            ref[part] = ref[part] || {};
            ref = ref[part];
          }
        }
      }
    }

    return bodyParams;
  }

  private replacePathParams(path: string, parameters: any): string {
    for (const [key, param] of Object.entries(parameters)) {
      const paramKey = (param as any).key ?? key;
      const paramType = (param as any).type;
      const paramValue = (param as any).value ?? `{{${paramKey}}}`;

      if (paramType === 'path') {
        path = path.replace(`:${paramKey}`, paramValue);
      }
    }
    return path;
  }
}
