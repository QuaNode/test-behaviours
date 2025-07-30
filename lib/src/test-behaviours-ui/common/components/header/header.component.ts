<<<<<<< HEAD
import { Component } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-services/export.service';
=======
import { Component, inject } from '@angular/core';
import { ExportService } from '../../../../test-behaviours-core/services/export-service/export.service';
>>>>>>> origin/mahmoudrabea

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private exportService: ExportService) {}

  export() {
    this.exportService.exportPostmanCollection();
  }
}
