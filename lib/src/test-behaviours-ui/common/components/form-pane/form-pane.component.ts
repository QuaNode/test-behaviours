import { Component } from '@angular/core';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';


@Component({
  selector: 'app-form-pane',
  templateUrl: './form-pane.component.html',
  styleUrls: ['./form-pane.component.scss']
})
export class FormPaneComponent  {
  requestUrl : any;
  requestMethod : any;
  constructor(private dataService: DataService){}
  ngOnInit() {
    this.dataService.sharedData.subscribe((data: any) => {
      if (data.url !== this.requestUrl||data.method !== this.requestMethod) {
        this.requestUrl = data.url;
        this.requestMethod = data.method;
      }
    });
  }
}
