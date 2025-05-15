import { Component, inject, input, Input, signal } from '@angular/core';
import { Request } from '../layout/layout.component';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  private dataService = inject(DataService);
  requests = input.required<Request[]>();
  selectedRow = signal<number | null>(null);

  setClickedRow(index: number) {
    const requestData = this.requests()[index];
    this.selectedRow.set(index);
    this.dataService.setSharedData(requestData);
  }
}
