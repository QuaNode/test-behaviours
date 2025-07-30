import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

import { environment } from '../../../../environment/environment';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';

@Component({
  selector: 'app-behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
})
export class BehaviourDetailsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  constructor(
    private requestsService: RequestsService,
    private behaviourService: BehaviorService
  ) {}

  loading = new BehaviorSubject<boolean>(false);

  get methodClass(): string {
    return this.requestsService.getMethodClass;
  }

  get requestData(): any {
    // We need to get the current value from the BehaviorSubject directly
    const request = this.requestsService.currentRequest || {};
    const isValid = this.requestsService.isValidData;
    return {
      url: isValid ? `${environment.apiUrl}${request?.path ?? ''}` : '',
      method: request?.method ?? '',
      version: request?.version ?? '',
      prefix: request?.prefix ?? '',
      events: request?.events ?? false,
      isValid,
      name: request?.name,
    };
  }

  ngOnInit() {
    // Watch for loading changes
    this.subscription.add(
      this.behaviourService.loadingSignal.subscribe((loading) => {
        this.loading.next(loading);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSend() {
    this.behaviourService.sendOnly(this.requestData);
  }

  onSendAndDownload() {
    this.behaviourService.sendAndDownload(this.requestData);
  }
}
