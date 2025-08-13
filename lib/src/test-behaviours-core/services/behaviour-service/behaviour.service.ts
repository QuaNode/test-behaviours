import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

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

  // Cache for API responses
  private responseCache = signal<Record<string, any>>({});
  private errorCache = signal<Record<string, any>>({});
  private responseTimeCache = signal<Record<string, number>>({});

  constructor() {
    // Load cached responses from localStorage
    this.loadCachedResponsesFromStorage();
  }

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

  // Cache management methods
  cacheResponse(
    apiName: string,
    response: any,
    error: any = null,
    responseTime: number = 0
  ) {
    const currentCache = this.responseCache();
    const currentErrorCache = this.errorCache();
    const currentTimeCache = this.responseTimeCache();

    this.responseCache.set({
      ...currentCache,
      [apiName]: response,
    });

    this.errorCache.set({
      ...currentErrorCache,
      [apiName]: error,
    });

    this.responseTimeCache.set({
      ...currentTimeCache,
      [apiName]: responseTime,
    });

    // Save to localStorage
    this.saveCachedResponsesToStorage();
  }

  private loadCachedResponsesFromStorage() {
    try {
      const savedResponses = localStorage.getItem('apiResponses');
      const savedErrors = localStorage.getItem('apiErrors');
      const savedTimes = localStorage.getItem('apiResponseTimes');

      if (savedResponses) {
        this.responseCache.set(JSON.parse(savedResponses));
      }
      if (savedErrors) {
        this.errorCache.set(JSON.parse(savedErrors));
      }
      if (savedTimes) {
        this.responseTimeCache.set(JSON.parse(savedTimes));
      }
    } catch (error) {
      console.error('Error loading cached responses from localStorage:', error);
    }
  }

  private saveCachedResponsesToStorage() {
    try {
      localStorage.setItem(
        'apiResponses',
        JSON.stringify(this.responseCache())
      );
      localStorage.setItem('apiErrors', JSON.stringify(this.errorCache()));
      localStorage.setItem(
        'apiResponseTimes',
        JSON.stringify(this.responseTimeCache())
      );
    } catch (error) {
      console.error('Error saving cached responses to localStorage:', error);
    }
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

  clearCache(apiName?: string) {
    if (apiName) {
      const currentCache = this.responseCache();
      const currentErrorCache = this.errorCache();
      const currentTimeCache = this.responseTimeCache();

      delete currentCache[apiName];
      delete currentErrorCache[apiName];
      delete currentTimeCache[apiName];

      this.responseCache.set({ ...currentCache });
      this.errorCache.set({ ...currentErrorCache });
      this.responseTimeCache.set({ ...currentTimeCache });
    } else {
      this.responseCache.set({});
      this.errorCache.set({});
      this.responseTimeCache.set({});
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

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let once = false;

    this.behaviours
      .getBehaviour(requestData.name)(params)
      .subscribe(
        (response: any) => {
          this.requestsService.updateRequestParameters(requestData.name);

          this.updateResponse(response);

          if (once) return;
          once = true;

          this.loadingSignal.set(false);

          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);
          this.responseTimeSignal.set(delay);

          // Cache the successful response
          this.cacheResponse(requestData.name, response, null, delay);

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
    return this.parametersSignal();
  }
}
