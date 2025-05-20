import { HttpClient } from '@angular/common/http';
import { Behaviours } from 'ng-behaviours';
import { Observable } from 'rxjs';
import { AppBehaviours } from '../models/collection'; // عدّل المسار حسب مكان ملف interfaces
import { environment } from '../../../src/environment/environment';

export class AppBehavioursImpl extends Behaviours implements AppBehaviours {
  private http: HttpClient;
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/behaviours`);
    this.http = http;
  }

  behaviours(parameters: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/behaviours`, { params: parameters });
  }
}
