import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

@Injectable({
  providedIn: 'root',
})
export class BehaviorService {
  private parametersSignal = new BehaviorSubject<any>(null);
  responseSignal = new BehaviorSubject<any>({});

  loadingSignal = new BehaviorSubject<boolean>(false);
  errorSignal = new BehaviorSubject<any>(null);
  responseTimeSignal = new BehaviorSubject<number | null>(null);

  // Cache for API responses
  private responseCache = new BehaviorSubject<Record<string, any>>({});
  private errorCache = new BehaviorSubject<Record<string, any>>({});
  private responseTimeCache = new BehaviorSubject<Record<string, number>>({});

  updateParameters(params: any) {
    this.parametersSignal.next(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal.value;
    return params && Object.keys(params).length > 0;
  }

  updateResponse(response: any) {
    this.responseSignal.next(response);
  }

  // Cache management methods
  cacheResponse(
    apiName: string,
    response: any,
    error: any = null,
    responseTime: number = 0
  ) {
    const currentCache = this.responseCache.value;
    const currentErrorCache = this.errorCache.value;
    const currentTimeCache = this.responseTimeCache.value;

    this.responseCache.next({
      ...currentCache,
      [apiName]: response,
    });

    this.errorCache.next({
      ...currentErrorCache,
      [apiName]: error,
    });

    this.responseTimeCache.next({
      ...currentTimeCache,
      [apiName]: responseTime,
    });
  }

  getCachedResponse(apiName: string): any {
    return this.responseCache.value[apiName];
  }

  getCachedError(apiName: string): any {
    return this.errorCache.value[apiName];
  }

  getCachedResponseTime(apiName: string): number | null {
    return this.responseTimeCache.value[apiName] || null;
  }

  hasCachedResponse(apiName: string): boolean {
    return apiName in this.responseCache.value;
  }

  clearCache(apiName?: string) {
    if (apiName) {
      const currentCache = this.responseCache.value;
      const currentErrorCache = this.errorCache.value;
      const currentTimeCache = this.responseTimeCache.value;

      delete currentCache[apiName];
      delete currentErrorCache[apiName];
      delete currentTimeCache[apiName];

      this.responseCache.next({ ...currentCache });
      this.errorCache.next({ ...currentErrorCache });
      this.responseTimeCache.next({ ...currentTimeCache });
    } else {
      this.responseCache.next({});
      this.errorCache.next({});
      this.responseTimeCache.next({});
    }
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

    this.loadingSignal.next(true);
    this.errorSignal.next(null);
    let once = false;

    this.behaviours
      .getBehaviour(requestData.name)(params)
      .subscribe(
        (response: any) => {
          this.requestsService.updateRequestParameters(requestData.name);

          this.updateResponse(response);

          if (once) return;
          once = true;

          this.loadingSignal.next(false);

          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);
          this.responseTimeSignal.next(delay);

          // Cache the successful response
          this.cacheResponse(requestData.name, response, null, delay);

          if (onSuccess) {
            onSuccess(response);
          }
        },
        (error: any) => {
          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);
          this.responseTimeSignal.next(delay);

          const formattedError = {
            message: error.message,
          };
          this.updateResponse(formattedError);
          this.errorSignal.next(error);
          this.loadingSignal.next(false);
          // Cache the error response
          this.cacheResponse(requestData.name, formattedError, error, delay);
        }
      );
  }

  sendOnly(requestData: any) {
    this.send(requestData);
  }

  sendAndDownload(requestData: any) {
    this.send(requestData, (response) =>
      this.downloadJSON(response, `${requestData.name}_response.json`)
    );
  }

  get parameters() {
    return this.parametersSignal.value;
  }

  constructor(
    @Inject(Behaviours) private behaviours: Behaviours,
    private requestsService: RequestsService
  ) {}
}
