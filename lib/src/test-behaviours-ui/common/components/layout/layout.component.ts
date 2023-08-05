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
    { name: 'lorem ipsum 2' },
    { name: 'lorem ipsum 3' },
    { name: 'lorem ipsum 4' },
    { name: 'lorem ipsum 5' },
    { name: 'lorem ipsum 6' },
    { name: 'lorem ipsum 7' },
    { name: 'lorem ipsum 8' },
    { name: 'lorem ipsum 9' },
    { name: 'lorem ipsum 10' },
    { name: 'lorem ipsum 11' },
    { name: 'lorem ipsum 12' },
  ];
}
