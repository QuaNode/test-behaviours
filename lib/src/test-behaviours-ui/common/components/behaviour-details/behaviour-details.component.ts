import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';
import { TEST_BEHAVIOURS_UI_CONFIG } from '../../../config/test-behaviours-ui-config';

@Component({
  selector: 'behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
  standalone: false,
})
export class BehaviourDetailsComponent {
  private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);
  private config = inject(TEST_BEHAVIOURS_UI_CONFIG);


  loading = signal<boolean>(false);

  methodClass = computed(() => {
    return this.requestsService.getMethodClass();
  });

  requestData = computed(() => {
    const request = this.requestsService.theRequest();
    const isValid = this.requestsService.isValidData();

    const base = this.config.baseURL ?? '';

    const baseForURL = base || window.location.origin;

    const fullURL = new URL(this.config.prefix.replace(/^\/+/, ''), baseForURL).toString();
    return {
      url: isValid ? `${fullURL}${request?.path ?? ''}` : '',
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
