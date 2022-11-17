import { TestBed } from '@angular/core/testing';

import { AdminRWXGuard } from './admin-rwx.guard';

describe('AdminRWXGuard', () => {
  let guard: AdminRWXGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminRWXGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
