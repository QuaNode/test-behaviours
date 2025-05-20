import { computed, inject, Injectable, signal } from '@angular/core';
import { RequestsService } from '../data-services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private requestsService = inject(RequestsService);
  private sanitizer = inject(DomSanitizer);

  private blobUrl = signal<string | null>(null);
  fileUrl = signal<SafeResourceUrl | null>(null);
  downloadedData = computed(() => this.requestsService.theRequest());

  isValidData = computed(() => {
    return this.requestsService.isValidData();
  });

  exportAsJson() {
    if (this.downloadedData() && this.isValidData()) {
      try {
        console.log('Exported');
        console.log(this.downloadedData());
        const str = JSON.stringify(this.downloadedData(), null, '\t');
        const blob = new Blob([str], {
          type: 'application/json;charset=utf-8',
        });
        const newBlobUrl = URL.createObjectURL(blob);
        this.blobUrl.set(newBlobUrl);
        this.fileUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(newBlobUrl)
        );
      } catch (error) {
        console.error('Error exporting data:', error);
        this.fileUrl.set(null);
        this.blobUrl.set(null);
      }
    } else {
      console.log('No valid data to export');
      this.fileUrl.set(null);
      if (this.blobUrl()) {
        URL.revokeObjectURL(this.blobUrl()!);
        this.blobUrl.set(null);
      }
    }
  }

  clearBlobUrl() {
    if (this.blobUrl()) {
      URL.revokeObjectURL(this.blobUrl()!);
      this.blobUrl.set(null);
      this.fileUrl.set(null);
    }
  }
}
