import { Component, computed, inject } from '@angular/core';
import { ExportService } from 'lib/src/test-behaviours-core/services/export-services/export.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  private exportsService = inject(ExportService);

  fileUrl = this.exportsService.fileUrl;

  export() {
    this.exportsService.exportAsJson();
  }

  ngOnDestroy() {
    this.exportsService.clearBlobUrl();
  }
}
