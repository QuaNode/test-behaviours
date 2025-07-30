import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestsService } from '../requests-services/requests.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { TEST_BEHAVIOURS_UI_CONFIG } from '../../../test-behaviours-ui/config/test-behaviours-ui-config';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(
    private requestsService: RequestsService,
    @Inject(TEST_BEHAVIOURS_UI_CONFIG) private config: any
  ) {}

  fileUrl = new BehaviorSubject<SafeResourceUrl | null>(null);

  get downloadedData() {
    return this.requestsService.theRequest;
  }

  get isValidData(): boolean {
    return this.requestsService.isValidData;
  }

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
    const requests = this.requestsService.currentRequests || [];

    const behaviourDefs = requests
      .filter((def: any) => def.name !== 'behaviours')
      .map((def: any) => {
        const method = def.method || 'GET';
        let path = def.path || '';

        //module configurations
        const baseURL = this.config.baseURL || 'http://localhost:8282';
        const prefix = this.config.prefix || '/api/v1';

        const headers: any[] = [];
        const bodyParams: Record<string, any> = {};
        const queryParams: any[] = [];

        for (const [key, param] of Object.entries(def.parameters ?? {})) {
          const paramKey = (param as any).key ?? key;
          const paramType = (param as any).type;
          const paramValue = (param as any).value ?? `{{${paramKey}}}`;

          switch (paramType) {
            case 'header':
              headers.push({ key: paramKey, value: paramValue, type: 'text' });
              break;

            case 'body':
              const pathParts = paramKey.split('.');
              let nestedRef = bodyParams;

              for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];
                if (i === pathParts.length - 1) {
                  nestedRef[part] = paramValue;
                } else {
                  if (!nestedRef[part]) nestedRef[part] = {};
                  nestedRef = nestedRef[part];
                }
              }
              break;

            case 'query':
              queryParams.push({ key: paramKey, value: paramValue });
              break;

            case 'path':
              path = path.replace(`:${paramKey}`, paramValue);
              break;
          }
        }

        const request: any = {
          method: method.toUpperCase(),
          header: headers,
          url: {
            raw: `${baseURL}${prefix}${path}${
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
