import { Injectable, inject, signal, OnDestroy, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { Behaviours } from 'ng-behaviours';
import { RequestsService } from '../requests-service/requests.service';

@Injectable()
export class BehaviorService implements OnDestroy {
  public apiName: string = '';

  constructor(
    private behaviours: Behaviours = inject(Behaviours),
    private requestsService: RequestsService = inject(RequestsService)
  ) {
    const initialClearValue = this.requestsService.clearSignal();
    effect(() => {
      if (this.requestsService.clearSignal() > initialClearValue) {
        this.clearAll();
      }
    });
  }

  parametersSignal = signal<any>(null);
  responseSignal = signal<any>({});
  errorSignal = signal<any>(null);
  responseTimeSignal = signal<number | null>(null);
  currentRequestNameSignal = signal<string | null>(null);

  private subscription: Subscription | null = null;

  private send(requestData: any, onSuccess?: (res: any) => void): void {
    if (!this.parametersSignal()) {
      return;
    }

    const clearCountAtStart = this.requestsService.clearSignal();
    const startTime = performance.now();
    this.requestsService.setLoadingState(true);
    this.errorSignal.set(null);

    let handled = false;
    this.currentRequestNameSignal.set(requestData.name);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.behaviours.getBehaviour(requestData.name)(this.parametersSignal()).subscribe({
      next: (response: any) => {
        // Stop processing if a 'clear' was triggered after this behavior started
        if (this.requestsService.clearSignal() > clearCountAtStart) {
          this.subscription?.unsubscribe();
          return;
        }

        this.requestsService.updateRequestParameters(requestData.name);
        this.updateResponse(response);

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.set(delay);
        this.requestsService.cacheResponse(requestData.name, response, null, delay);

        if (handled) return;
        handled = true;

        if (onSuccess) {
          onSuccess(response);
        }
        this.requestsService.setLoadingState(false);
      },
      error: (error: any) => {
        if (this.requestsService.clearSignal() > clearCountAtStart) {
          this.subscription?.unsubscribe();
          return;
        }

        const delay = Math.round(performance.now() - startTime);
        this.responseTimeSignal.set(delay);

        const formattedError = { message: error.message };
        this.updateResponse(formattedError);
        this.errorSignal.set(error);
        this.requestsService.cacheResponse(requestData.name, formattedError, error, delay);

        this.requestsService.setLoadingState(false);
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

  updateResponse(response: any): void {
    this.responseSignal.set(response);
  }

  clearAll(): void {
    this.parametersSignal.set(null);
    this.responseSignal.set({});
    this.errorSignal.set(null);
    this.responseTimeSignal.set(null);
    this.currentRequestNameSignal.set(null);

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
