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

  }

  parametersSignal = new BehaviorSubject<any>(null);
  responseSignal = new BehaviorSubject<any>({});
  errorSignal = new BehaviorSubject<any>(null);
  responseTimeSignal = new BehaviorSubject<number | null>(null);

  private send(requestData: any, onSuccess?: (res: any) => void): void {
    const params = this.parametersSignal.getValue();
    if (!params) return;

    const startTime = performance.now();
    this.requestsService.setLoadingState(true);
    this.errorSignal.next(null);

    let handled = false;
    const handleResponse = (): void => {
      if (handled) return;
      handled = true;
      this.requestsService.setLoadingState(false);
    };

    this.behaviours.getBehaviour(requestData.name)(params).subscribe({
      next: (response: any) => {
        this.requestsService.updateRequestParameters(requestData.name);
        this.updateResponse(response);

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.next(delay);
        this.requestsService.cacheResponse(requestData.name, response, null, delay);

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
    this.parametersSignal.next(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal.value;
    return params && Object.keys(params).length > 0;
  }

  updateResponse(response: any): void {
    this.responseSignal.next(response);
  }
}
