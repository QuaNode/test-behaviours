import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  HostListener,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';
import { TEST_BEHAVIOURS_UI_CONFIG } from '../../../config/test-behaviours-ui-config';

@Component({
  selector: 'behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
})
export class BehaviourDetailsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  constructor(
    private requestsService: RequestsService,
    private behaviourService: BehaviorService,
    @Inject(TEST_BEHAVIOURS_UI_CONFIG) private config: any
  ) {}

  loading = new BehaviorSubject<boolean>(false);
  isDropdownOpen = false;

  get methodClass(): string {
    return this.requestsService.getMethodClass;
  }

  get requestData(): any {
    // We need to get the current value from the BehaviorSubject directly
    const request = this.requestsService.currentRequest || {};
    const isValid = this.requestsService.isValidData;
    const base = this.config.baseURL || window.location.origin;
    const prefix = this.config.prefix;

    const fullURL = new URL(prefix, base).href;
    return {
      url: isValid ? `${fullURL}${request?.path ?? ''}` : '',
      method: request?.method ?? '',
      version: request?.version ?? '',
      prefix: request?.prefix ?? '',
      events: request?.events ?? false,
      isValid,
      name: request.name,
    };
  }

  ngOnInit() {
    // Watch for loading changes
    this.subscription.add(
      this.behaviourService.loadingSignal.subscribe((loading) => {
        this.loading.next(loading);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSend() {
    this.behaviourService.sendOnly(this.requestData);
  }

  onSendAndDownload() {
    this.behaviourService.sendAndDownload(this.requestData);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.btn-group')) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    console.log('toggleDropdown called, current state:', this.isDropdownOpen);
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('new state:', this.isDropdownOpen);
  }
}
