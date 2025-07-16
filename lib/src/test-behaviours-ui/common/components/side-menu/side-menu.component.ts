import { Component, computed, effect, inject, signal } from '@angular/core';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

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
}
