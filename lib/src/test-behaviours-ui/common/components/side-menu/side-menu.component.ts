import { Component, Inject, inject, input, Input, OnInit, signal } from '@angular/core';
import { Request } from '../layout/layout.component';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
import { Behaviours } from 'ng-behaviours';

import { Router } from '@angular/router';
import { AppBehaviours } from '../../../../../src/test-behaviours-core/models/collection';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: false,
})
export class SideMenuComponent implements OnInit {
  private dataService = inject(DataService);

  @Input() requests: Request[] = [];
  selectedRow = signal<number | null>(null);

 constructor(
    @Inject(Behaviours) private behaviours: AppBehaviours,

  ) {}

  Sidemenutitels= signal<string[]> ([]);
  ngOnInit(): void {
      this.behaviours.behaviours({}).subscribe({
      next: (res: any) => {
        console.log(res);
        this.Sidemenutitels.set(Object.keys(res));
        this.requests = Object.values(res);
      },
     })

  }


  setClickedRow(index: number) {
    const requestData = this.requests[index];
    this.selectedRow.set(index);
    this.dataService.setSharedData(requestData);
  }
}
