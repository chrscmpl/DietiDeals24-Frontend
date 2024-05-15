import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { auctionsRequestGuard } from './auctions-request.guard';

describe('auctionsRequestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => auctionsRequestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
