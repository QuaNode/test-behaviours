import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
    selector: 'app-form-pane',
    templateUrl: './form-pane.component.html',
    styleUrls: ['./form-pane.component.scss'],
    standalone: false
})
export class FormPaneComponent {
  private dataService = inject(DataService);

  requestUrl = computed(() => {
    const sharedData = this.dataService.sharedData();
    return sharedData?.url ?? '';
  });

  requestMethod = computed(() => {
    const sharedData = this.dataService.sharedData();
    return sharedData?.method ?? '';
  });
}
