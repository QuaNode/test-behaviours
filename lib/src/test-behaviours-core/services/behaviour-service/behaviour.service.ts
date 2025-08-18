import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

@Injectable({ providedIn: 'root' })
export class BehaviorService {

  constructor(
    private behaviours: Behaviours,
    private requestsService: RequestsService
  ) {
    this.loadCacheFromStorage();
  }

  parametersSignal = new BehaviorSubject<any>(null);
  responseSignal = new BehaviorSubject<any>({});
  loadingSignal = new BehaviorSubject<boolean>(false);
  errorSignal = new BehaviorSubject<any>(null);
  responseTimeSignal = new BehaviorSubject<number | null>(null);

  private responseCache = new BehaviorSubject<Record<string, any>>({});
  private errorCache = new BehaviorSubject<Record<string, any>>({});
  private responseTimeCache = new BehaviorSubject<Record<string, number>>({});

  updateParameters(params: any): void {
    this.parametersSignal.next(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal.getValue();
    return params && Object.keys(params).length > 0;
  }

  updateResponse(response: any): void {
    this.responseSignal.next(response);
  }

  private loadCacheFromStorage(): void {
    try {
      const savedResponses = localStorage.getItem('apiResponses') || '{}';
      const savedErrors = localStorage.getItem('apiErrors') || '{}';
      const savedTimes = localStorage.getItem('apiResponseTimes') || '{}';

      this.responseCache.next(JSON.parse(savedResponses));
      this.errorCache.next(JSON.parse(savedErrors));
      this.responseTimeCache.next(JSON.parse(savedTimes));
    } catch (e) {
      console.error('Cache load error:', e);
      this.clearCache();
    }
  }

  private saveCacheToStorage(): void {
    localStorage.setItem('apiResponses', JSON.stringify(this.responseCache.getValue()));
    localStorage.setItem('apiErrors', JSON.stringify(this.errorCache.getValue()));
    localStorage.setItem('apiResponseTimes', JSON.stringify(this.responseTimeCache.getValue()));
  }

  cacheResponse(apiName: string, response: any, error: any = null, responseTime: number = 0): void {
    const currentResponseCache = { ...this.responseCache.getValue(), [apiName]: response };
    const currentErrorCache = { ...this.errorCache.getValue(), [apiName]: error };
    const currentTimeCache = { ...this.responseTimeCache.getValue(), [apiName]: responseTime };

    this.responseCache.next(currentResponseCache);
    this.errorCache.next(currentErrorCache);
    this.responseTimeCache.next(currentTimeCache);

    this.saveCacheToStorage();
  }

  getCachedResponse(apiName: string): any {
    return this.responseCache.getValue()[apiName];
  }

  getCachedError(apiName: string): any {
    return this.errorCache.getValue()[apiName];
  }

  getCachedResponseTime(apiName: string): number | null {
    return this.responseTimeCache.getValue()[apiName] || null;
  }

  hasCachedResponse(apiName: string): boolean {
    return apiName in this.responseCache.getValue();
  }

  clearCache(apiName?: string): void {
    if (apiName) {
      const currentCache = { ...this.responseCache.getValue() };
      const currentErrorCache = { ...this.errorCache.getValue() };
      const currentTimeCache = { ...this.responseTimeCache.getValue() };

      delete currentCache[apiName];
      delete currentErrorCache[apiName];
      delete currentTimeCache[apiName];

      this.responseCache.next(currentCache);
      this.errorCache.next(currentErrorCache);
      this.responseTimeCache.next(currentTimeCache);
    } else {
      this.responseCache.next({});
      this.errorCache.next({});
      this.responseTimeCache.next({});
    }
    this.saveCacheToStorage();
  }

  private send(requestData: any, onSuccess?: (res: any) => void): void {
    const params = this.parametersSignal.getValue();
    if (!params) return;

    const startTime = performance.now();
    this.loadingSignal.next(true);
    this.errorSignal.next(null);

    let handled = false;
    const handleResponse = (): void => {
      if (handled) return;
      handled = true;
      this.loadingSignal.next(false);
    };

    this.behaviours.getBehaviour(requestData.name)(params).subscribe({
      next: (response: any) => {
        this.requestsService.updateRequestParameters(requestData.name);
        this.updateResponse(response);

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.next(delay);
        this.cacheResponse(requestData.name, response, null, delay);

        if (onSuccess) {
          onSuccess(response);
        }
        handleResponse();
      },
      error: (error: any) => {
        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.next(delay);

        const formattedError = { message: error.message };
        this.updateResponse(formattedError);
        this.errorSignal.next(error);
        this.cacheResponse(requestData.name, formattedError, error, delay);

        handleResponse();
      }
    });
  }

  sendOnly(requestData: any): void {
    this.send(requestData);
  }

  sendAndDownload(requestData: any): void {
    this.send(requestData, (response: any) =>
      this.downloadJSON(response, `${requestData.name}_response.json`)
    );
  }

  downloadJSON(data: any, fileName: string = 'response.json'): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  get parameters(): any {
    return this.parametersSignal.getValue();
  }
}
