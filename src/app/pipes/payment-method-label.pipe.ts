import { Pipe, PipeTransform } from '@angular/core';
import { PaymentMethodType } from '../enums/payment-method-type.enum';

@Pipe({
    name: 'paymentMethodLabel',
    standalone: true,
})
export class PaymentMethodLabelPipe implements PipeTransform {
    public transform(value: PaymentMethodType): string {
        switch (value) {
            case PaymentMethodType.creditCard:
                return 'credit card';
            case PaymentMethodType.IBAN:
                return 'bank account';
            default:
                return '';
        }
    }
}
