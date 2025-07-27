import { Component, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';

@Component({
  selector: 'app-header',
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
