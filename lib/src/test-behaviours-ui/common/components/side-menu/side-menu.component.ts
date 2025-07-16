import { Component, computed, effect, inject, signal } from '@angular/core';
import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})
export class SideMenuComponent {

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
    effect(() => {
      const reqs = this.requests();
      if (!reqs || reqs.length === 0 || this.selectedRequestIndex() !== null)
        return;

      const firstValidIndex = reqs.findIndex((r) => r.name !== 'behaviours');
      if (firstValidIndex !== -1) {
        this.selectRequest(firstValidIndex);
      }
    });
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
