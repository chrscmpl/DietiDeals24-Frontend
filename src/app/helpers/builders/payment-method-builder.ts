import {
    CreditCardDTO,
    IBANDTO,
    PaymentMethodDTO,
} from '../../DTOs/payment-method.dto';
import { PaymentMethodType } from '../../enums/payment-method-type';
import {
    CreditCard,
    IBAN,
    PaymentMethod,
} from '../../models/payment-method.model';
import { Builder } from './builder';

export const paymentMethodBuilder = new Builder<
    PaymentMethodDTO,
    PaymentMethod
>((dto) => {
    switch (dto.type) {
        case PaymentMethodType.creditCard:
            return new CreditCard(dto as CreditCardDTO);
        case PaymentMethodType.IBAN:
            return new IBAN(dto as IBANDTO);
        default:
            throw new Error('Invalid payment method DTO');
    }
});
