

import { Component, Input } from '@angular/core';
import { Request } from '../layout/layout.component';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @Input() requests!: Request[];
  setClickedRow: Function;
  selectedRow!: Number;

  constructor(private dataService: DataService) {
    this.setClickedRow = (index: any) => {
      this.selectedRow = index;
      this.dataService.setSharedData(this.requests[index]);
    };
  }

  getMethodClass(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'text-success'; 
      case 'POST':
        return 'text-warning'; 
      case 'PUT':
        return 'text-primary'; 
      case 'DELETE':
        return 'text-danger'; 
      default:
        return 'text-secondary'; 
    }
  }
}

