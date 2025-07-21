import { inject, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Behaviours } from 'ng-behaviours';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  private behaviours = inject(Behaviours);
  private parametersSignal = signal<any>(null);
  responseSignal = signal<any>({
    status: 'success',
    user: {
      id: 1,
      name: 'Martina',
      token: 'abc123xyz',
      roles: ['admin', 'editor'],
    },
    timestamp: new Date().toISOString(),
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

  downloadJSON(data: any, fileName: string = 'response.json') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  }

  sendAndDownload(requestData: any) {
    const params = this.parameters;
    console.log(params);
    if (params) {
      this.behaviours
        .getBehaviour(requestData.name)(params)
        .subscribe(
          (response: any) => {
            console.log(response);
            this.updateResponse(response);
            this.downloadJSON(response, `${requestData.name}_response.json`);
          },
          (error: Error) => {
            console.log(error)
          }
        );
    }
  }

  get parameters() {
    return this.parametersSignal();
  }
}
