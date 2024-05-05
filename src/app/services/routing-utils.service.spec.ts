import { TestBed } from '@angular/core/testing';

import { RoutingUtilsService } from './routing-utils.service';

describe('RoutingUtilsService', () => {
    let service: RoutingUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RoutingUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
