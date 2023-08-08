import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class DataService {
  private static sharedDataSource = new BehaviorSubject<void>(undefined);
  sharedData = DataService.sharedDataSource.asObservable();

  setSharedData(data: any) {
    DataService.sharedDataSource.next(data);
  }
  getSharedData() {
    return {...DataService.sharedDataSource};
  }
}
