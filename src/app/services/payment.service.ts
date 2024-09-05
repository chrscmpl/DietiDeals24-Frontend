import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {
    catchError,
    map,
    merge,
    Observable,
    of,
    Subject,
    switchMap,
    throwError,
} from 'rxjs';
import { PaymentMethod } from '../models/payment-method.model';
import { HttpClient } from '@angular/common/http';
import { Cacheable } from 'ts-cacheable';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { PaymentMethodType } from '../enums/payment-method-type';
import { ActiveBidsCacheBuster$ } from './bid.service';
import { PaymentMethodDTO } from '../DTOs/payment-method.dto';
import { environment } from '../../environments/environment';
import { OwnActiveAuctionsCacheBuster$ } from './auctioneer.service';
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

const paymentMethodsCacheBuster$ = new Subject<void>();

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    constructor(
        private readonly authentication: AuthenticationService,
        private readonly http: HttpClient,
        private readonly deserializer: PaymentMethodDeserializer,
        private readonly unauthorizedPaymentMethodSerializer: UnauthorizedPaymentMethodSerializer,
        private readonly creditCardAuthorizationDataDeserializer: CreditCardAuthorizationDataDeserializer,
    ) {
        merge([
            this.authentication.isLogged$,
            ActiveBidsCacheBuster$,
            OwnActiveAuctionsCacheBuster$,
        ]).subscribe(() => paymentMethodsCacheBuster$.next());
    }

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
                          >(`${environment.backendHost}/payments/methods`)
                          .pipe(
                              map((dtos) =>
                                  this.deserializer.deserializeArray(dtos),
                              ),
                          ),
            ),
        );
    }
}
