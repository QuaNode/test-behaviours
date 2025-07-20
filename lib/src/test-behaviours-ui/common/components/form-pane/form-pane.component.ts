import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

import { environment } from '../../../../../src/environment/environment';
import { IntegrationService } from '../../../../test-behaviours-core/services/integration-services/integration.service';

@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss'],
  standalone: false,
})
export class FormPaneComponent {
  private requestsService = inject(RequestsService);
  private integrationService = inject(IntegrationService);

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

  // Ameen Integration
  isSendEnabled(): boolean {
    return this.integrationService.hasParameters();
  }

  onSend() {
    this.integrationService.sendAndDownload(this.requestData());
  }
}
