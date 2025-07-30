import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-services/requests.service';

@Injectable({
  providedIn: 'root',
})
export class BehaviorService {
  private parametersSignal = new BehaviorSubject<any>(null);
  responseSignal = new BehaviorSubject<any>({});

  loadingSignal = new BehaviorSubject<boolean>(false);
  errorSignal = new BehaviorSubject<any>(null);
  responseTimeSignal = new BehaviorSubject<number | null>(null);

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

    this.behaviours
      .getBehaviour(requestData.name)(params)
      .subscribe(
        (response: any) => {
          const endTime = performance.now();
          const delay = Math.round(endTime - startTime);

          this.responseTimeSignal.next(delay);

          this.requestsService.updateRequestParametersWithDraft(
            requestData.name
          );

          this.updateResponse(response);
          this.loadingSignal.next(false);

          // mahmoud
          this.requestsService.setParameterValuesForRequest(
            requestData.name,
            params
          );

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
