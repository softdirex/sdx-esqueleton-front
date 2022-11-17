import { TestBed } from '@angular/core/testing';

import { CustomerRWGuard } from './customer-rw.guard';

describe('CustomerRWGuard', () => {
  let guard: CustomerRWGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomerRWGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
