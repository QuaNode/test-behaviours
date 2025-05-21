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
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'LINK'];
selectedMethod: string = 'GET';

getMethodClass(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'text-success';    
    case 'POST':
      return 'text-warning';    
    case 'PUT':
      return 'text-primary';    
    case 'PATCH':
      return 'text-info';      
    case 'DELETE':
      return 'text-danger';     
    default:
      return 'text-secondary'; 
  }
}



}
