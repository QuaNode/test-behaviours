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
    this.setClickedRow = function (index: any) {
      this.selectedRow = index;
      this.dataService.setSharedData(this.requests[index]);
    };
  }
}
