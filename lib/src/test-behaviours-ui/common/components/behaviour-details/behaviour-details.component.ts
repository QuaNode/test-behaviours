import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';
import { TEST_BEHAVIOURS_UI_CONFIG } from '../../../config/test-behaviours-ui-config';

<<<<<<< HEAD
import { environment } from '../../../../environment/environment';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';

=======
>>>>>>> origin/mahmoudrabea
@Component({
  selector: 'behaviour-details',
  templateUrl: './behaviour-details.component.html',
  styleUrls: ['./behaviour-details.component.scss'],
})
<<<<<<< HEAD
export class BehaviourDetailsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
=======
export class BehaviourDetailsComponent {
  private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);
  private config = inject(TEST_BEHAVIOURS_UI_CONFIG);

>>>>>>> origin/mahmoudrabea

  constructor(
    private requestsService: RequestsService,
    private behaviourService: BehaviorService
  ) {}

<<<<<<< HEAD
  loading = new BehaviorSubject<boolean>(false);

  get methodClass(): string {
    return this.requestsService.getMethodClass;
  }

  get requestData(): any {
    // We need to get the current value from the BehaviorSubject directly
    const request = this.requestsService.currentRequest || {};
    const isValid = this.requestsService.isValidData;
=======
  methodClass = computed(() => {
    return this.requestsService.getMethodClass();
  });

  requestData = computed(() => {
    const request = this.requestsService.theRequest();
    const isValid = this.requestsService.isValidData();

    const base = this.config.baseURL ?? '';

    const baseForURL = base || window.location.origin;

    const fullURL = new URL(this.config.prefix.replace(/^\/+/, ''), baseForURL).toString();
>>>>>>> origin/mahmoudrabea
    return {
      url: isValid ? `${fullURL}${request?.path ?? ''}` : '',
      method: request?.method ?? '',
      version: request?.version ?? '',
      prefix: request?.prefix ?? '',
      events: request?.events ?? false,
      isValid,
      name: request?.name,
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
}
