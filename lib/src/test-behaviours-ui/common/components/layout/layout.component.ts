import { Component, Input } from '@angular/core';

export interface Request {
  name: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  requests: Request[] = [
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
    { name: 'lorem ipsum 1' },
  ];
}
