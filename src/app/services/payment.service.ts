import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { filter, map, Observable, of, Subject, switchMap } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { HttpClient } from '@angular/common/http';
import { PaymentMethodDTO } from '../DTOs/payment-method.dto';
import { Cacheable } from 'ts-cacheable';
import { environment } from '../../environments/environment';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { paymentMethodBuilder } from '../helpers/builders/payment-method-builder';
import { PaymentMethodType } from '../enums/payment-method-type';

const paymentMethodCacheBuster = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(
        private readonly authentication: AuthenticationService,
        private readonly http: HttpClient,
    ) {
        this.authentication.isLogged$.subscribe(() =>
            paymentMethodCacheBuster.next(),
        );
    }

    @Cacheable({
        maxCacheCount: Object.keys(PaymentMethodCategory).length + 1,
        cacheBusterObserver: paymentMethodCacheBuster.asObservable(),
    })
    public getPaymentMethods(
        category?: PaymentMethodCategory,
    ): Observable<PaymentMethod[]> {
        return this.authentication.isLogged$.pipe(
            switchMap((isLogged) =>
                !isLogged
                    ? of([])
                    : // : this.http
                      //       .get<
                      //           PaymentMethodDTO[]
                      //       >(`${environment.backendHost}/payment-methods`)
                      of([
                          {
                              id: '1',
                              type: PaymentMethodType.creditCard,
                              cardNumber: '1234 5678 1234 5678',
                          },
                          {
                              id: '2',
                              type: PaymentMethodType.IBAN,
                              iban: 'GB33BUKB20201555555555',
                          },
                          {
                              id: '3',
                              type: PaymentMethodType.creditCard,
                              cardNumber: '9876 5432 9876 5432',
                          },
                          {
                              id: '4',
                              type: PaymentMethodType.IBAN,
                              iban: 'IT60X0542811101000000123456',
                          },
                      ]).pipe(
                          map((dtos) =>
                              paymentMethodBuilder
                                  .buildArray(dtos)
                                  .filter(
                                      (method) =>
                                          !category ||
                                          method.category === category,
                                  ),
                          ),
                      ),
            ),
        );
    }
}
