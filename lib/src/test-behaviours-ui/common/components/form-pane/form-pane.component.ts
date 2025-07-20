import {
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

import { environment } from '../../../../../src/environment/environment';
import { IntegrationService } from '../../../../test-behaviours-core/services/integration-services/integration.service';
import { Behaviours } from 'ng-behaviours';
import {
  TEST_BEHAVIOURS_UI_CONFIG,
} from '../../../config/test-behaviours-ui-config';

@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss'],
  standalone: false,
})
export class FormPaneComponent implements OnInit {
  config = inject(TEST_BEHAVIOURS_UI_CONFIG, { optional: true });
  private router = inject(Router);
  private requestsService = inject(RequestsService);
  private integrationService = inject(IntegrationService);
  private behaviours = inject(Behaviours);

  ngOnInit(): void {
    const route = this.config?.defaultRoute;
    console.log('redirecting to', route);

    if (route && this.router.url === '/') {
      this.router.navigateByUrl(route);
    }
  }

  get showHeader(): boolean {
    return this.config?.showHeader ?? true;
  }

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

  exportPostmanCollection() {
    const collection = this.requestsService.generatePostmanCollection();
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-api.postman_collection.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Ameen Integration
  isSendEnabled(): boolean {
    return this.integrationService.hasParameters();
  }

  onSend() {
    const params = this.integrationService.parameters;
    if (params) {
      this.behaviours
        .getBehaviour(this.requestData().name)(params)
        .subscribe(
          (response: any) => {
            return this.integrationService.updateResponse(response);
          },
          (error: any) => console.error('Error:', error)
        );
    }
  }

}
