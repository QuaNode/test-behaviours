import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataService } from 'lib/src/test-behaviours-core/services/data-services/data.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent {
  private sanitizer = inject(DomSanitizer);
  private dataService = inject(DataService);
  private blobUrl: string | null = null;
  fileUrl = signal<SafeResourceUrl | null>(null);

  downloadedData = computed(() => {
    const data = this.dataService.sharedData();
    return data;
  });

  isDataValid = computed(() => {
    const data = this.downloadedData();
    return this.isValidData(data);
  });

  private exportData(data: any) {
    if (data && this.isValidData(data)) {
      const str = JSON.stringify(data, null, '\t');
      const blob = new Blob([str], {
        type: 'application/json;charset=utf-8',
      });
      if (this.blobUrl) {
        URL.revokeObjectURL(this.blobUrl);
      }
      this.blobUrl = window.URL.createObjectURL(blob);
      this.fileUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl)
      );
    } else {
      console.log('No valid data to export');
      this.fileUrl.set(null);
      if (this.blobUrl) {
        URL.revokeObjectURL(this.blobUrl);
        this.blobUrl = null;
      }
    }
  }

  private isValidData(data: any): boolean {
    return !!(data && (data.url || data.name || data.method));
  }

  export() {
    const data = this.downloadedData();
    this.exportData(data);
  }

  ngOnDestroy() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
      this.fileUrl.set(null);
    }
  }
}

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
