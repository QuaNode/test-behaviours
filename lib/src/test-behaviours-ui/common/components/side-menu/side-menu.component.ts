import { Component, Input } from '@angular/core';
import { Request } from '../layout/layout.component';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  @Input() request!: Request;

}
