import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditorTextFormat } from '../../models/collection';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../src/environment/environment';



@Injectable({
  providedIn: 'root',
})
export class DataService {

  private sharedDataSource = signal<EditorTextFormat>({
    version: '',
    method: '',
    path: '',
    prefix: '',
    events: true,
    parameters: {}, 
    returns: {},
  });

  sharedData = this.sharedDataSource.asReadonly();

  setSharedData(data: EditorTextFormat) {
    this.sharedDataSource.set(data);
  }
}
