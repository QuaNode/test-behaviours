import { Component, computed, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';
import { IntegrationService } from '../../../../test-behaviours-core/services/integration-services/integration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  private exportsService = inject(ExportService);
  private requestsService = inject(RequestsService);
  private integrationService = inject(IntegrationService);

  fileUrl = this.exportsService.fileUrl;

  export() {
    this.exportsService.exportAsJson();
  }

  ngOnDestroy() {
    this.exportsService.clearBlobUrl();
  }

  exportPostmanCollection() {
    const requests = this.requestsService.theRequests() ?? [];
    const parameters = this.requestsService.theRequest()?.parameters
    const collection = this.integrationService.generatePostmanCollection(requests, parameters);
    const blob = new Blob([JSON.stringify(collection, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Behaviours';
    a.click();
    URL.revokeObjectURL(url);
  }
}
