import { Component, computed, effect, inject, signal } from '@angular/core';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
import { environment } from '../../../../../src/environment/environment';

@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss'],
  standalone: false,
})
export class FormPaneComponent {
  private dataService = inject(DataService);

  requestUrl = computed(() => {
    const sharedData = this.dataService.sharedData();
    return `${environment.apiUrl}` + `${sharedData?.path ?? ''}`;
  });

  requestMethod = computed(() => {
    const sharedData = this.dataService.sharedData();
    return sharedData?.method ?? '';
  });

  sharedData = this.dataService.sharedData;
  version = computed(() => this.sharedData()?.version ?? '');
  prefix = computed(() => this.sharedData()?.prefix ?? '');
  events = computed(() => this.sharedData()?.events ?? false);



  getSelectStyle(method: string) {
  if (method === 'GET') {
    return {
      color: 'green',
      fontWeight:'bold',
    };
  } else if (method === 'POST') {
    return {
      color: ' #f57600',
      fontWeight:'bold',
    };
  } else {
    return {
      color: 'black',
      fontWeight:'bold',
    };
  }
}

}
