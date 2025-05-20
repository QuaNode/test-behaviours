import { Component, computed, effect, inject, signal } from '@angular/core';

import { RequestsService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

import { environment } from '../../../../../src/environment/environment';

@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss'],
  standalone: false,
})
export class FormPaneComponent {
  private requestsService = inject(RequestsService);

  request = this.requestsService.theRequest;

  requestUrl = computed(() => {
    return `${environment.apiUrl}` + `${this.request()?.path ?? ''}`;
  });

  requestMethod = computed(() => {
    return this.request()?.method ?? '';
  });


  version = computed(() => this.request()?.version ?? '');
  prefix = computed(() => this.request()?.prefix ?? '');
  events = computed(() => this.request()?.events ?? false);

  getSelectStyle(method: string) {
    if (method === 'GET') {
      return {
        color: 'green',
        fontWeight: 'bold',
      };
    } else if (method === 'POST') {
      return {
        color: ' #f57600',
        fontWeight: 'bold',
      };
    } else {
      return {
        color: 'black',
        fontWeight: 'bold',
      };
    }
  }

}
