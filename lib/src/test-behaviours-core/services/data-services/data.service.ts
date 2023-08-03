import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sharedDataSource = new BehaviorSubject<string>("");
  sharedData = this.sharedDataSource.asObservable();
  setSharedData(data: any) {
    this.sharedDataSource.next(data);
  }
  getSharedData() {
    return {...this.sharedData};
  }
}
