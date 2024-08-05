import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { HttpClient } from '@angular/common/http';
import { Cacheable } from 'ts-cacheable';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { paymentMethodBuilder } from '../helpers/builders/payment-method-builder';
import { PaymentMethodType } from '../enums/payment-method-type';
import { newBidMade$ } from './bid.service';

const newPaymentMethodAdded$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(
        private readonly authentication: AuthenticationService,
        private readonly http: HttpClient,
    ) {
        this.authentication.isLogged$.subscribe(() =>
            newPaymentMethodAdded$.next(),
        );
        newBidMade$.subscribe(() => newPaymentMethodAdded$.next());
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
        cacheBusterObserver: newPaymentMethodAdded$,
    })
    private retrieveAllPaymentMethods(): Observable<PaymentMethod[]> {
        return this.authentication.isLogged$.pipe(
            switchMap((isLogged) =>
                !isLogged
                    ? throwError(() => new Error('User is not authenticated'))
                    : // : this.http
                      //       .get<
                      //           PaymentMethodDTO[]
                      //       >(`${environment.backendHost}/payment-methods`)
                      of([
                          {
                              id: '1',
                              type: PaymentMethodType.creditCard,
                              cardNumberLastDigits: '5678',
                          },
                          {
                              id: '2',
                              type: PaymentMethodType.IBAN,
                              iban: 'GB33BUKB20201555555555',
                          },
                          {
                              id: '3',
                              type: PaymentMethodType.creditCard,
                              cardNumberLastDigits: '9876',
                          },
                          {
                              id: '4',
                              type: PaymentMethodType.IBAN,
                              iban: 'IT60X0542811101000000123456',
                          },
                      ]).pipe(
                          map((dtos) => paymentMethodBuilder.buildArray(dtos)),
                      ),
            ),
        );
    }
}
