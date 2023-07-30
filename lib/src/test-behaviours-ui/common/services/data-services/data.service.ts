import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private myData: any;

  setSharingData(data: any) {
    this.myData = data;
  }

  getSharingData() {
    return this.myData;
  }
}
