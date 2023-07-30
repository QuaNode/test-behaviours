import { Component } from '@angular/core';
import { DataService } from '../../services/data-services/data.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  requests = [
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
  ];

}
