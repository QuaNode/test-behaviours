import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private static sharedData: any;

  setSharedData(data: any) {
    DataService.sharedData = data;
  }

  getSharedData() {
    return {...DataService.sharedData};
  }
}
