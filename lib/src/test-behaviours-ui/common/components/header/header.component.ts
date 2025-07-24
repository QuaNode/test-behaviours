import { Component, inject, OnDestroy  } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnDestroy {
  private exportService = inject(ExportService);

  export() {
    this.exportService.exportAsJson();
    this.exportService.exportPostmanCollection();
  }

  ngOnDestroy() {
    this.exportService.clearBlobUrl();
  }
}
