import { Component, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-service/export.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  private exportService = inject(ExportService);

  export() {
    this.exportService.exportPostmanCollection();
  }
}
