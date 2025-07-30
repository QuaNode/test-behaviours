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

    let once = false;

    this.behaviours
      .getBehaviour(requestData.name)(params)
      .subscribe(
        (response: any) => {

          this.requestsService.updateRequestParameters(
            requestData.name
          );

          this.updateResponse(response);

          if (once) return;
          once = true;

          this.loadingSignal.set(false);

          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);
          this.responseTimeSignal.set(delay);

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
}
