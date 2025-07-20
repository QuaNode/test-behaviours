import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';

import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
  standalone: false,
})
export class BehaviourDetailsComponent {
  private requestsService = inject(RequestsService);
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
    };
  });
}
