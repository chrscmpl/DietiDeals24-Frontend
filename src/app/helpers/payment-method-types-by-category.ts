import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { PaymentMethodType } from '../enums/payment-method-type';

export const paymentMethodTypesByCategory = new Map<
    PaymentMethodCategory,
    PaymentMethodType[]
>([
    [PaymentMethodCategory.paying, [PaymentMethodType.creditCard]],
    [PaymentMethodCategory.receiving, [PaymentMethodType.IBAN]],
]);
