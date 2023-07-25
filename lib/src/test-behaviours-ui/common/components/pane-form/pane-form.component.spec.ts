import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaneFormComponent } from './pane-form.component';

describe('PaneFormComponent', () => {
  let component: PaneFormComponent;
  let fixture: ComponentFixture<PaneFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaneFormComponent]
    });
    fixture = TestBed.createComponent(PaneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
