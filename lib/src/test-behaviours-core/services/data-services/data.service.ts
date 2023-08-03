import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public sharedData: any ='testtt';

  setSharedData(data: any) {
    this.sharedData = data;
  }

  getSharedData() {
    return {...this.sharedData};
  }
}
