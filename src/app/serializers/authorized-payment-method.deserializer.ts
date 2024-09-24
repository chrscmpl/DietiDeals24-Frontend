import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import { AuthorizedPaymentMethodRegistrationDTO } from '../dtos/payment-method.dto';

import {
    AuthorizedCreditCard,
    AuthorizedIBAN,
    AuthorizedPaymentMethod,
} from '../models/authorized-payment-method.model';
import { PaymentMethodType } from '../enums/payment-method-type.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthorizedPaymentMethodSerializer
    implements
        Serializer<
            AuthorizedPaymentMethod,
            AuthorizedPaymentMethodRegistrationDTO
        >
{
    public serialize(
        paymentMethod: AuthorizedPaymentMethod,
    ): AuthorizedPaymentMethodRegistrationDTO {
        if (paymentMethod instanceof AuthorizedIBAN)
            return {
                type: PaymentMethodType.IBAN,
                ibanString: paymentMethod.iban,
            };
        if (paymentMethod instanceof AuthorizedCreditCard)
            return {
                type: PaymentMethodType.creditCard,
                last4digits: paymentMethod.cardNumberLastDigits,
                creditCardToken: paymentMethod.token,
            };

        throw new Error(
            `AuthorizedPaymentMethodSerializer: unsupported payment method type ${paymentMethod.constructor.name}`,
        );
    }

    public serializeArray(
        paymentMethods: AuthorizedPaymentMethod[],
    ): AuthorizedPaymentMethodRegistrationDTO[] {
        return paymentMethods.map((paymentMethod) =>
            this.serialize(paymentMethod),
        );
    }
}
