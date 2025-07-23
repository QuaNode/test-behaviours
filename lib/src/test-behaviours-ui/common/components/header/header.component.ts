import { Component, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  private exportsService = inject(ExportService);
  private behaviourService = inject(BehaviorService);

  fileUrl = this.exportsService.fileUrl;

  export() {
    this.exportsService.exportAsJson();
    this.exportPostmanCollection();
  }

  ngOnDestroy() {
    this.exportsService.clearBlobUrl();
  }

  exportPostmanCollection() {
    const collection = this.behaviourService.generatePostmanCollection();
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
