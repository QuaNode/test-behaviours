import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersAndReturnsComponent } from '../Parameters-And-Returns/parameters-and-returns';

describe('ParametersAndReturnsComponent', () => {
  let component: ParametersAndReturnsComponent;
  let fixture: ComponentFixture<ParametersAndReturnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParametersAndReturnsComponent]
    });
    fixture = TestBed.createComponent(ParametersAndReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
