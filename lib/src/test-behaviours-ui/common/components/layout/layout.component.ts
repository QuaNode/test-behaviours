import { Component, Input } from '@angular/core';

export interface Request {
  name: string;
  method: string;
  url: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  requests: Request[] = [
    { name: 'lorem ipsum 1',method:'get',url:'https://github.com/lorem ipsum 1'},
    { name: 'lorem ipsum 2',method:'get',url:'https://github.com/lorem ipsum 2'}, 
    { name: 'lorem ipsum 3',method:'get',url:'https://github.com/lorem ipsum 3'},
    { name: 'lorem ipsum 4',method:'get',url:'https://github.com/lorem ipsum 4'},
    { name: 'lorem ipsum 5',method:'get',url:'https://github.com/lorem ipsum 5'},
    { name: 'lorem ipsum 6',method:'get',url:'https://github.com/lorem ipsum 6'},
    { name: 'lorem ipsum 7',method:'get',url:'https://github.com/lorem ipsum 7'},
  ];
}
