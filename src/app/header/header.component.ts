import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'lib/src/test-behaviours-core/services/data-services/data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  
  fileUrl: any;

  // obj = {
  //   //this is a test object the real object should be passed from the sidebar according to the request
  //   info: {
  //     _postman_id: '1a5e15b9-3634-41ce-ba97-39941849ed3c',
  //     name: 'Api Testing',
  //     schema:
  //       'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  //     _exporter_id: '13132253',
  //   },
  // };
  constructor(private sanitizer: DomSanitizer,private dataService: DataService) {}
  export() {
    // let previewFormat = this.exportService.getCollection(this.data);
    // console.log(previewFormat);
    let previewData = this.downloadedData();
    const str = JSON.stringify(previewData);
    const blob = new Blob([str], {
      type: 'application/json;charset=utf-8',
    });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      window.URL.createObjectURL(blob)
    );
  }
  downloadedData(){
    let   jsonData: any;
    this.dataService.sharedData.subscribe((data:any) => {
      if (data !== jsonData) {
           jsonData = data;
        }
  });
  return jsonData;
  }




}
