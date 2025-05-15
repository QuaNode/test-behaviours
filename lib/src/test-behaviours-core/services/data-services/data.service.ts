import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditorTextFormat } from '../../models/collection';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private sharedDataSource = signal<EditorTextFormat>({
    url: '',
    name: '',
    method: '',
  });

  sharedData = this.sharedDataSource.asReadonly();

  setSharedData(data: EditorTextFormat) {
    this.sharedDataSource.set(data);
  }
}
