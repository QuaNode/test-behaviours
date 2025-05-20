import { Component, computed, inject, Input, signal } from '@angular/core';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

export interface Request {
    version: string,
    method: string,
    path: string,
    prefix: string,
    events:boolean
}

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: false
})
export class LayoutComponent {
 private dataService=inject(DataService)
  requests = signal<Request[]>([]);
}
