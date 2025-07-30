import { Component } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private exportService: ExportService) {}

  export() {
    this.exportService.exportPostmanCollection();
  }
}
