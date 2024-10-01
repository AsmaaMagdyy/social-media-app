import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logedguardGuard } from './logedguard.guard';

describe('logedguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logedguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
