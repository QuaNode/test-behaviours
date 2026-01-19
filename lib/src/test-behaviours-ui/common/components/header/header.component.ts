import { Component, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-service/export.service';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';
import { computed } from '@angular/core';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  private exportService = inject(ExportService);
    private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);
  private resetForm(): void {
    // this.requestsService.draftData.set({});
}

  export() {
    this.exportService.exportPostmanCollection();
  }

  loading = this.requestsService.loadingSignal;

hasData = computed(() => {
  return (
    this.requestsService.isValidData() ||
    !!this.behaviourService.responseSignal()
  );
});

onClear(): void {
  this.behaviourService.responseSignal.set(null);
  this.behaviourService.clearAll();
  this.requestsService.clearAll();

  this.resetForm();
} 



}
