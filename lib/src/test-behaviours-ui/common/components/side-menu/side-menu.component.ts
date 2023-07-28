import { Component } from '@angular/core';

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
