import { TestBed } from '@angular/core/testing';
import { HttpInterceptor } from '@angular/common/http';

import { AuthorizationInterceptor } from './authorization.interceptor';

describe('authorizationInterceptor', () => {
    const interceptor: HttpInterceptor = new AuthorizationInterceptor();

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });
});
