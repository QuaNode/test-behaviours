import { Injectable, inject, signal, effect } from '@angular/core';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

@Injectable({ providedIn: 'root' })
export class BehaviorService {
  private behaviours = inject(Behaviours);
  private requestsService = inject(RequestsService);

  parametersSignal = signal<any>(null);
  responseSignal = signal<any>({});
  errorSignal = signal<any>(null);
  responseTimeSignal = signal<number | null>(null);

  private send(requestData: any, onSuccess?: (res: any) => void): void {
    if (!this.parametersSignal()) return;

    const startTime = performance.now();
    this.requestsService.setLoadingState(true);
    this.errorSignal.set(null);

    let handled = false;
    const handleResponse = (): void => {
      if (handled) return;
      handled = true;
      this.requestsService.setLoadingState(false);
    };

    this.behaviours.getBehaviour(requestData.name)(this.parametersSignal()).subscribe({
      next: (response: any) => {
        this.requestsService.updateRequestParameters(requestData.name);
        this.updateResponse(response);

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.set(delay);
        this.requestsService.cacheResponse(requestData.name, response, null, delay);

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
        this.requestsService.cacheResponse(requestData.name, formattedError, error, delay);

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
}
