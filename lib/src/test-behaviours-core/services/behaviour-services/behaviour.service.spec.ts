import { TestBed } from '@angular/core/testing';
import { BehaviorService } from './behaviour.service';

describe('IntegrationService', () => {
  let service: BehaviorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BehaviorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
