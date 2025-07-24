import { computed, inject, Injectable, signal } from '@angular/core';
import { RequestsService } from '../requests-services/requests.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private requestsService = inject(RequestsService);
  private sanitizer = inject(DomSanitizer);

  private blobUrl = signal<string | null>(null);
  fileUrl = signal<SafeResourceUrl | null>(null);

  downloadedData = computed(() => this.requestsService.theRequest());
  isValidData = computed(() => this.requestsService.isValidData());

  exportAsJson(): void {
    const data = this.downloadedData();
    if (!data || !this.isValidData()) {
      console.warn('No valid data to export');
      this.clearBlobUrl();
      return;
    }

    const str = JSON.stringify(data, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    this.setDownloadUrl(url);
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

  private setDownloadUrl(url: string): void {
    this.clearBlobUrl();
    this.blobUrl.set(url);
    this.fileUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  clearBlobUrl(): void {
    if (this.blobUrl()) {
      URL.revokeObjectURL(this.blobUrl()!);
      this.blobUrl.set(null);
      this.fileUrl.set(null);
    }
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
