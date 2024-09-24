import { Injectable } from '@angular/core';
import { Serializer } from './serializer.interface';
import {
    UnauthorizedCreditCard,
    UnauthorizedIBAN,
    UnauthorizedPaymentMethod,
} from '../models/unauthorized-payment-method.model';
import { UnauthorizedPaymentMethodRegistrationDTO } from '../dtos/payment-method.dto';
import { PaymentMethodType } from '../enums/payment-method-type.enum';

@Injectable({
    providedIn: 'root',
})
export class UnauthorizedPaymentMethodSerializer
    implements
        Serializer<
            UnauthorizedPaymentMethod,
            UnauthorizedPaymentMethodRegistrationDTO
        >
{
    public serialize(
        paymentMethod: UnauthorizedPaymentMethod,
    ): UnauthorizedPaymentMethodRegistrationDTO {
        if (paymentMethod instanceof UnauthorizedCreditCard) {
            return {
                type: PaymentMethodType.creditCard,
                ownerName: paymentMethod.ownerName,
                cardNumber: paymentMethod.cardNumber,
                expirationDate: paymentMethod.expirationDate.toISOString(),
                cvv: paymentMethod.cvv,
            };
        }
        if (paymentMethod instanceof UnauthorizedIBAN) {
            return {
                type: PaymentMethodType.IBAN,
                iban: paymentMethod.iban,
            };
        }
        throw new Error(
            `UnauthorizedPaymentMethodSerializer: unsupported payment method type ${paymentMethod.constructor.name}`,
        );
    }

    public serializeArray(
        paymentMethods: UnauthorizedPaymentMethod[],
    ): UnauthorizedPaymentMethodRegistrationDTO[] {
        return paymentMethods.map((paymentMethod) =>
            this.serialize(paymentMethod),
        );
    }
}
