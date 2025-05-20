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
  switch (method.toLowerCase()) {
    case 'get':
      return 'text-success'; // أخضر
    case 'post':
      return 'text-primary'; // أزرق
    case 'put':
      return 'text-warning'; // أصفر
    case 'patch':
      return 'text-info'; // سماوي
    case 'delete':
      return 'text-danger'; // أحمر
    default:
      return 'text-secondary'; // رمادي
  }
}

}
