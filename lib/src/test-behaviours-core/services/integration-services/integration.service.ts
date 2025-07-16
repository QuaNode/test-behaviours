import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private parametersSignal = signal<any>(null);
  responseSignal = signal<any>({
    status: 'success',
    data: {
      id: 1,
      name: 'Martina',
      date: '2025-07-14',
      token: 'abc123xyz',
      roles: ['admin', 'editor'],
    },
  });

  updateParameters(params: any) {
    this.parametersSignal.set(params);
  }

  hasParameters(): boolean {
    const params = this.parametersSignal();
    return params && Object.keys(params).length > 0;
  }

  updateResponse(response: any) {
    this.responseSignal.set(response);
  }

  get parameters() {
    return this.parametersSignal();
  }
}
