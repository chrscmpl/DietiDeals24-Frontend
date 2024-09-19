import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { HttpClient } from '@angular/common/http';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { PaymentMethodType } from '../enums/payment-method-type.enum';
import { PaymentMethodDTO } from '../DTOs/payment-method.dto';
import { PaymentAuthorizationException } from '../exceptions/payment-authorization.exception';
import { PaymentMethodDeserializer } from '../deserializers/payment-method.deserializer';
import { UnauthorizedPaymentMethod } from '../models/unauthorized-payment-method.model';
import { UnauthorizedPaymentMethodSerializer } from '../serializers/unauthorized-payment-method.serializer';
import { CreditCardAuthorizationDataDeserializer } from '../deserializers/credit-card-authorization-data.deserializer';
import {
    AuthorizedCreditCard,
    AuthorizedIBAN,
    AuthorizedPaymentMethod,
} from '../models/authorized-payment-method.model';
import { cacheBusters } from '../helpers/cache-busters';
import { DeletePaymentMethodException } from '../exceptions/delete-payment-method.exception';
import { GetPaymentMethodsException } from '../exceptions/get-payment-methods.exception';
import { AuthorizedPaymentMethodSerializer } from '../serializers/authorized-payment-method.deserializer';
import { SavePaymentMethodException } from '../exceptions/save-payment-method.exception';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(
        private readonly http: HttpClient,
        private readonly deserializer: PaymentMethodDeserializer,
        private readonly authorizedPaymentMethodSerializer: AuthorizedPaymentMethodSerializer,
        private readonly unauthorizedPaymentMethodSerializer: UnauthorizedPaymentMethodSerializer,
        private readonly creditCardAuthorizationDataDeserializer: CreditCardAuthorizationDataDeserializer,
    ) {}

    // this method is a mock implementation, this
    // platform does not actually process payments
    public authorizePayment(
        paymentMethod: UnauthorizedPaymentMethod,
    ): Observable<AuthorizedPaymentMethod> {
        const unauthorizedDTO =
            this.unauthorizedPaymentMethodSerializer.serialize(paymentMethod);

        return (
            (unauthorizedDTO.type === PaymentMethodType.IBAN
                ? of(new AuthorizedIBAN(unauthorizedDTO.iban))
                : of(
                      this.creditCardAuthorizationDataDeserializer.deserialize({
                          token: '123456',
                      }),
                  ).pipe(
                      map(
                          (data) =>
                              new AuthorizedCreditCard(
                                  data.token,
                                  unauthorizedDTO.cardNumber.substring(
                                      unauthorizedDTO.cardNumber.length - 4,
                                  ),
                              ),
                      ),
                  )) as Observable<AuthorizedPaymentMethod>
        ).pipe(
            catchError((e) =>
                throwError(() => new PaymentAuthorizationException(e)),
            ),
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

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.paymentMethods$,
    })
    public savePaymentMethod(
        paymentMethod: AuthorizedPaymentMethod,
    ): Observable<unknown> {
        return this.http
            .post(
                'payment-methods/new',
                this.authorizedPaymentMethodSerializer.serialize(paymentMethod),
                { responseType: 'text' },
            )
            .pipe(
                catchError((e) =>
                    throwError(() => new SavePaymentMethodException(e)),
                ),
            );
    }

    @CacheBuster({
        cacheBusterNotifier: cacheBusters.paymentMethods$,
    })
    public deletePaymentMethod(id: string): Observable<unknown> {
        return this.http
            .delete('payment-methods/delete', {
                params: {
                    paymentMethodId: id,
                },
                responseType: 'text',
            })
            .pipe(
                catchError((e) =>
                    throwError(() => new DeletePaymentMethodException(e)),
                ),
            );
    }

    @Cacheable({
        cacheBusterObserver: cacheBusters.paymentMethods$,
    })
    private retrieveAllPaymentMethods(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethodDTO[]>('payment-methods/list').pipe(
            map((dtos) => this.deserializer.deserializeArray(dtos)),
            catchError((e) =>
                throwError(() => new GetPaymentMethodsException(e)),
            ),
        );
    }
}
