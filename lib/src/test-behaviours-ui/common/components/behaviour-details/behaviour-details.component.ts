import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

import { environment } from '../../../../environment/environment';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';
@Component({
  selector: 'app-behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
  standalone: false,
})
export class BehaviourDetailsComponent {
  private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);

  loading = signal<boolean>(false);


  methodClass = computed(() => {
    return this.requestsService.getMethodClass();
  });

  requestData = computed(() => {
    const request = this.requestsService.theRequest();
    const isValid = this.requestsService.isValidData();
    return {
      url: isValid ? `${environment.apiUrl}${request?.path ?? ''}` : '',
      method: request?.method ?? '',
      version: request?.version ?? '',
      prefix: request?.prefix ?? '',
      events: request?.events ?? false,
      isValid,
      name: request.name,
    };
  });

  constructor() {
    effect(() => {
      this.loading.update((prev) => this.behaviourService.loadingSignal());
    });
  }

  onSend() {
    this.behaviourService.sendOnly(this.requestData());
  }

  onSendAndDownload() {
    this.behaviourService.sendAndDownload(this.requestData());
  }
}