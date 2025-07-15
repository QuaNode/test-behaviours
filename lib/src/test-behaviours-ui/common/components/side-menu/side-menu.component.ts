import { Component, computed, effect, inject, signal } from '@angular/core';
import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})
export class SideMenuComponent {
  testResult: any = null;

  newRequest = {
    name: 'login',
    method: 'POST',
    path: '/auth/login',
    version: '1.0.0',
    prefix: '/api/v1',
    events: true,
    parametersJson: '{"body": { "email": "string", "password": "string" }}',
    returnsJson: '{"token": "string"}',
  };

  showForm = false;

  methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  private requestsService = inject(RequestsService);

  selectedRequestIndex = signal<number | null>(null);

  requests = this.requestsService.theRequests;

  methodClass = computed(() => {
    return this.requestsService.getMethodClass();
  });

  selectRequest(index: number) {
    const requests = this.requests() || [];
    const requestData = requests[index];
    this.selectedRequestIndex.set(index);
    this.requestsService.setRequest(requestData);
  }

  constructor() {
    // ✅ Auto-select first request only when requests are ready
    effect(() => {
      const reqs = this.requests();
      if (!reqs || reqs.length === 0 || this.selectedRequestIndex() !== null)
        return;

      // ✅ Find first request that is not 'behaviours'
      const firstValidIndex = reqs.findIndex((r) => r.name !== 'behaviours');
      if (firstValidIndex !== -1) {
        this.selectRequest(firstValidIndex);
      }
    });
  }

  generateRequestFromJson(raw: {
    name: string;
    method: string;
    path: string;
    version: string;
    prefix: string;
    events: boolean;
    parametersJson?: string;
    returnsJson?: string;
  }): any {
    try {
      const parameters = raw.parametersJson
        ? JSON.parse(raw.parametersJson)
        : {};
      const returns = raw.returnsJson ? JSON.parse(raw.returnsJson) : {};

      const result = {
        name: raw.name,
        method: raw.method,
        path: raw.path,
        version: raw.version,
        prefix: raw.prefix,
        events: raw.events,
        parameters,
        returns,
      };

      return result;
    } catch (error) {
      console.error('Invalid JSON format in parameters or returns:', error);
      return null;
    }
  }

  testGenerateJson() {
    this.testResult = this.generateRequestFromJson(this.newRequest);
  }

  submitNewRequest() {
  try {
    const parameters = this.newRequest.parametersJson
      ? JSON.parse(this.newRequest.parametersJson)
      : {};

    const returns = this.newRequest.returnsJson
      ? JSON.parse(this.newRequest.returnsJson)
      : {};

    this.requestsService.addCustomRequest(this.newRequest.name, {
      name: this.newRequest.name,
      method: this.newRequest.method,
      path: this.newRequest.path,
      version: this.newRequest.version,
      prefix: this.newRequest.prefix,
      events: this.newRequest.events,
      parameters,
      returns
    });

    this.resetForm();
  } catch (e) {
    alert('Invalid JSON in parameters or returns!');
  }
}

resetForm() {
  this.newRequest = {
    name: '',
    method: '',
    path: '',
    version: '',
    prefix: '',
    events: false,
    parametersJson: '',
    returnsJson: ''
  };
}
  getMethodClass(method: string) {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'text-get';
      case 'POST':
        return 'text-post';
      case 'PUT':
        return 'text-put';
      case 'PATCH':
        return 'text-patch';
      case 'DELETE':
        return 'text-delete';
      default:
        return '';
    }
  }
}
