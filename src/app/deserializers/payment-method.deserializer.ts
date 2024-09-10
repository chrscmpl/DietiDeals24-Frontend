import { Injectable } from '@angular/core';
import { Deserializer } from './deserializer.interface';
import {
    CreditCardDTO,
    IBANDTO,
    PaymentMethodDTO,
} from '../DTOs/payment-method.dto';
import {
    CreditCard,
    IBAN,
    PaymentMethod,
} from '../models/payment-method.model';
import { PaymentMethodType } from '../enums/payment-method-type';

type PaymentMethodDeserializableDTO = PaymentMethodDTO & {
    type: PaymentMethodType;
};

@Injectable({
    providedIn: 'root',
})
export class PaymentMethodDeserializer
    implements Deserializer<PaymentMethodDeserializableDTO, PaymentMethod>
{
    public deserialize(dto: PaymentMethodDeserializableDTO): PaymentMethod {
        switch (dto.type) {
            case PaymentMethodType.creditCard:
                return new CreditCard(
                    dto as CreditCardDTO & {
                        type: PaymentMethodType.creditCard;
                    },
                );
            case PaymentMethodType.IBAN:
                return new IBAN(
                    dto as IBANDTO & { type: PaymentMethodType.IBAN },
                );
            default:
                throw new Error('Invalid payment method DTO');
        }
    }

    public deserializeArray(
        dtos: PaymentMethodDeserializableDTO[],
    ): PaymentMethod[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
