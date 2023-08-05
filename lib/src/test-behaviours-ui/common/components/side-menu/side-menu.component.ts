import { Component, Input } from '@angular/core';
import { Request } from '../layout/layout.component';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
<<<<<<< HEAD

=======
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @Input() requests!: Request[];
<<<<<<< HEAD
  setClickedRow: Function;
  selectedRow!: Number;
  constructor(private dataService: DataService) {
    this.setClickedRow = function (index: any) {
      this.selectedRow = index;
      this.dataService.setSharedData(this.requests[index])
    };
=======
  setClickedRow : Function;
  selectedRow !: Number;
  constructor(private dataService: DataService){
    this.setClickedRow = function(index:any){
      this.selectedRow = index;         
      this.dataService.setSharedData(this.requests[index]); 
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
  }
}
