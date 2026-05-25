import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviourDetailsComponent } from './behaviour-details.component';

describe('FormPaneComponent', () => {
  let component: BehaviourDetailsComponent;
  let fixture: ComponentFixture<BehaviourDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BehaviourDetailsComponent],
    });
    fixture = TestBed.createComponent(BehaviourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
