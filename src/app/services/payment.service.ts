import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { HttpClient } from '@angular/common/http';
import { Cacheable } from 'ts-cacheable';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { paymentMethodBuilder } from '../helpers/builders/payment-method-builder';
import { PaymentMethodType } from '../enums/payment-method-type';
import { ActiveBidsCacheBuster$ } from './bid.service';
import {
    AuthorizedPaymentMethodRegistrationDTO,
    PaymentMethodDTO,
    UnauthorizedPaymentMethodRegistrationDTO,
} from '../DTOs/payment-method.dto';
import { environment } from '../../environments/environment';

const paymentMethodsCacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(
        private readonly authentication: AuthenticationService,
        private readonly http: HttpClient,
    ) {
        this.authentication.isLogged$.subscribe(() =>
            paymentMethodsCacheBuster$.next(),
        );
        ActiveBidsCacheBuster$.subscribe(() =>
            paymentMethodsCacheBuster$.next(),
        );
    }

    // this method is a mock implementation, this
    // platform does not actually process payments
    public authorizePayment(
        paymentMethod: UnauthorizedPaymentMethodRegistrationDTO,
    ): Observable<AuthorizedPaymentMethodRegistrationDTO> {
        return of(
            paymentMethod.type === PaymentMethodType.IBAN
                ? paymentMethod
                : {
                      type: PaymentMethodType.creditCard,
                      token: '123456',
                      cardNumberLastDigits:
                          paymentMethod?.cardNumber?.slice(-4),
                  },
        );
    }

    public getPaymentMethods(
        category?: PaymentMethodCategory,
    ): Observable<PaymentMethod[]> {
        return this.retrieveAllPaymentMethods().pipe(
            map((methods) => {
                if (!category) return methods;
                return methods.filter((method) => method.category === category);
            }),
        );
    }

    @Cacheable({
        cacheBusterObserver: paymentMethodsCacheBuster$,
    })
    private retrieveAllPaymentMethods(): Observable<PaymentMethod[]> {
        return this.authentication.isLogged$.pipe(
            switchMap((isLogged) =>
                !isLogged
                    ? throwError(() => new Error('User is not authenticated'))
                    : this.http
                          .get<
                              PaymentMethodDTO[]
                          >(`${environment.backendHost}/payment-methods`)
                          .pipe(
                              map((dtos) =>
                                  paymentMethodBuilder.buildArray(dtos),
                              ),
                          ),
            ),
        );
    }
}
