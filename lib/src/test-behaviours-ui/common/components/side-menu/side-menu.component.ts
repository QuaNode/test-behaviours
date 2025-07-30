<<<<<<< HEAD
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';
=======
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
>>>>>>> origin/mahmoudrabea

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
<<<<<<< HEAD
export class SideMenuComponent implements OnInit, OnDestroy {
=======
export class SideMenuComponent {
>>>>>>> origin/mahmoudrabea
  methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  private subscription = new Subscription();

  selectedRequestIndex = new BehaviorSubject<number | null>(null);

  constructor(private requestsService: RequestsService) {}

  requests = this.requestsService.theRequests;

  get methodClass(): string {
    return this.requestsService.getMethodClass;
  }

  selectRequest(index: number) {
    // We need to get the current value from the BehaviorSubject directly
    const requests = this.requestsService.currentRequests || [];
    const requestData = requests[index];
    this.selectedRequestIndex.next(index);
    this.requestsService.setRequest(requestData);
  }

  ngOnInit() {
    // Watch for requests changes
    this.subscription.add(
      this.requests.subscribe((reqs) => {
        if (
          !reqs ||
          reqs.length === 0 ||
          this.selectedRequestIndex.value !== null
        )
          return;

        const firstValidIndex = reqs.findIndex(
          (r: any) => r.name !== 'behaviours'
        );
        if (firstValidIndex !== -1) {
          this.selectRequest(firstValidIndex);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  trackByIndex(index: number, item: any): number {
    return index;
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
