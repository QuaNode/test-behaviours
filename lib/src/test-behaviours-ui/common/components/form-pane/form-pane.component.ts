import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';

import { environment } from '../../../../../src/environment/environment';

@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss'],
  standalone: false,
})
export class FormPaneComponent {
  private requestsService = inject(RequestsService);

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
    };
  });



}
