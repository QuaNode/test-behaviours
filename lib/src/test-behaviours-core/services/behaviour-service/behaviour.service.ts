import { Injectable, inject, signal } from '@angular/core';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

@Injectable({ providedIn: 'root' })
export class BehaviorService {

  private behaviours = inject(Behaviours);
  private requestsService = inject(RequestsService);


  parametersSignal = signal<any>(null);
  responseSignal = signal<any>({});
  loadingSignal = signal<boolean>(false);
  errorSignal = signal<any>(null);
  responseTimeSignal = signal<number | null>(null);


  private responseCache = signal<Record<string, any>>({});
  private errorCache = signal<Record<string, any>>({});
  private responseTimeCache = signal<Record<string, number>>({});

  constructor() {
    this.loadCacheFromStorage();
  }


  updateParameters(params: any): void {
    this.parametersSignal.set(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal();
    return params && Object.keys(params).length > 0;
  }


  updateResponse(response: any): void {
    this.responseSignal.set(response);
  }


  private loadCacheFromStorage(): void {
    try {
      const savedResponses = localStorage.getItem('apiResponses') || '{}';
      const savedErrors = localStorage.getItem('apiErrors') || '{}';
      const savedTimes = localStorage.getItem('apiResponseTimes') || '{}';

      this.responseCache.set(JSON.parse(savedResponses));
      this.errorCache.set(JSON.parse(savedErrors));
      this.responseTimeCache.set(JSON.parse(savedTimes));
    } catch (e) {
      console.error('Cache load error:', e);
      this.clearCache();
    }
  }

  private saveCacheToStorage(): void {
    localStorage.setItem('apiResponses', JSON.stringify(this.responseCache()));
    localStorage.setItem('apiErrors', JSON.stringify(this.errorCache()));
    localStorage.setItem('apiResponseTimes', JSON.stringify(this.responseTimeCache()));
  }

  cacheResponse(apiName: string, response: any, error: any = null, responseTime: number = 0): void {
    this.responseCache.update(cache => ({ ...cache, [apiName]: response }));
    this.errorCache.update(cache => ({ ...cache, [apiName]: error }));
    this.responseTimeCache.update(cache => ({ ...cache, [apiName]: responseTime }));
    this.saveCacheToStorage();
  }

  getCachedResponse(apiName: string): any {
    return this.responseCache()[apiName];
  }

  getCachedError(apiName: string): any {
    return this.errorCache()[apiName];
  }

  getCachedResponseTime(apiName: string): number | null {
    return this.responseTimeCache()[apiName] || null;
  }

  hasCachedResponse(apiName: string): boolean {
    return apiName in this.responseCache();
  }

  clearCache(apiName?: string): void {
    if (apiName) {
      const currentCache = { ...this.responseCache() };
      const currentErrorCache = { ...this.errorCache() };
      const currentTimeCache = { ...this.responseTimeCache() };

      delete currentCache[apiName];
      delete currentErrorCache[apiName];
      delete currentTimeCache[apiName];

      this.responseCache.set(currentCache);
      this.errorCache.set(currentErrorCache);
      this.responseTimeCache.set(currentTimeCache);
    } else {
      this.responseCache.set({});
      this.errorCache.set({});
      this.responseTimeCache.set({});
    }
    this.saveCacheToStorage();
  }


  private send(requestData: any, onSuccess?: (res: any) => void): void {
    if (!this.parametersSignal()) return;

    const startTime = performance.now();
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let handled = false;
    const handleResponse = (): void => {
      if (handled) return;
      handled = true;
      this.loadingSignal.set(false);
    };

    this.behaviours.getBehaviour(requestData.name)(this.parametersSignal()).subscribe({
      next: (response: any) => {
        this.requestsService.updateRequestParameters(requestData.name);
        this.updateResponse(response);

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.set(delay);
        this.cacheResponse(requestData.name, response, null, delay);

        if (onSuccess) {
          onSuccess(response);
        }
        handleResponse();
      },
      error: (error: any) => {
        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.set(delay);

        const formattedError = { message: error.message };
        this.updateResponse(formattedError);
        this.errorSignal.set(error);
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
    return this.parametersSignal();
  }
}