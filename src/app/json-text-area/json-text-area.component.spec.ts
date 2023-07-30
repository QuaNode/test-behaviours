import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonTextAreaComponent } from './json-text-area.component';

describe('JsonTextAreaComponent', () => {
  let component: JsonTextAreaComponent;
  let fixture: ComponentFixture<JsonTextAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonTextAreaComponent]
    });
    fixture = TestBed.createComponent(JsonTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
