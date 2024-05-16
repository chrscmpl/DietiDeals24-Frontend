import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { ShowUIGuard } from './show-ui.guard';

describe('showUIGuard', () => {
    const executeGuard: CanDeactivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => ShowUIGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
