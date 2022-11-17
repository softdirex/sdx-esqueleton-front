import { TestBed } from '@angular/core/testing';

import { CustomerRWXGuard } from './customer-rwx.guard';

describe('CustomerRWXGuard', () => {
  let guard: CustomerRWXGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomerRWXGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
