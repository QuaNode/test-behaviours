import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
<<<<<<< HEAD

=======
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
@Injectable({
  providedIn: 'root'
})
export class DataService {
<<<<<<< HEAD
  private static sharedDataSource = new BehaviorSubject<string>("");
  sharedData = DataService.sharedDataSource.asObservable();

  setSharedData(data: any) {
    DataService.sharedDataSource.next(data);
=======
  private sharedDataSource = new BehaviorSubject<string>("");
  sharedData = this.sharedDataSource.asObservable();
  setSharedData(data: any) {
    this.sharedDataSource.next(data);
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
  }
  getSharedData() {
<<<<<<< HEAD
    return {...DataService.sharedDataSource};
=======
    return {...this.sharedData};
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
  }
}
