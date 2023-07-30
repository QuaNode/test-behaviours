import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  obj = {         //this is a test object the real object should be passed from the sidebar according to the request
    "info": {
        "_postman_id": "1a5e15b9-3634-41ce-ba97-39941849ed3c",
        "name": "Api Testing",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        "_exporter_id": "13132253"
    },
};
  fileUrl:any;
  constructor(private sanitizer: DomSanitizer) {}
  export() {
    const str = JSON.stringify(this.obj);
    const blob = new Blob([str], {
      type: 'application/json;charset=utf-8',
    });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
    
  }
}
