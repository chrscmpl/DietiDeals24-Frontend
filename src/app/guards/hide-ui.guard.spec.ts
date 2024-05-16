import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { HideUIGuard } from './hide-ui.guard';

describe('hideUIGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => HideUIGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
