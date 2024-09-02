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

@Injectable({
    providedIn: 'root',
})
export class PaymentMethodDeserializer
    implements Deserializer<PaymentMethodDTO, PaymentMethod>
{
    public deserialize(dto: PaymentMethodDTO): PaymentMethod {
        switch (dto.type) {
            case PaymentMethodType.creditCard:
                return new CreditCard(dto as CreditCardDTO);
            case PaymentMethodType.IBAN:
                return new IBAN(dto as IBANDTO);
            default:
                throw new Error('Invalid payment method DTO');
        }
    }

    public deserializeArray(dtos: PaymentMethodDTO[]): PaymentMethod[] {
        return dtos.map((dto) => this.deserialize(dto));
    }
}
