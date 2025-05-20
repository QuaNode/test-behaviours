
import { Component, inject, signal } from '@angular/core';
import { RequestsService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})

export class SideMenuComponent {
  private requestsService = inject(RequestsService);

  selectedRequestIndex = signal<number | null>(null);

  requests = this.requestsService.theRequests;

  selectRequest(index: number) {
    const requests = this.requests() || [];
    const requestData = requests[index];
    this.selectedRequestIndex.set(index);
    this.requestsService.setRequest(requestData);
  }
}
