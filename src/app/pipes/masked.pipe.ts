import { Pipe, PipeTransform } from '@angular/core';
import { PaymentMethodType } from '../enums/payment-method-type';

@Pipe({
    name: 'masked',
    standalone: true,
})
export class MaskedPipe implements PipeTransform {
    public transform(
        value: string,
        type: 'email' | PaymentMethodType | 'string' = 'string',
    ): string {
        if (type === 'email') return this.transformEmail(value);
        if (type === PaymentMethodType.creditCard)
            return this.transformCreditCard(value);
        if (type === PaymentMethodType.IBAN) return this.transformIBAN(value);
        return this.transformString(value);
    }

    private transformEmail(value: string): string {
        const email = value.split('@');
        if (email.length !== 2) return value;

        const local: string =
            email[0].length > 2
                ? `${email[0].slice(0, 2)}***`
                : `${email[0][0]}***`;

        return `${local}@${email[1]}`;
    }

    private transformCreditCard(value: string): string {
        return '**** **** **** ' + value.slice(-4);
    }

    private transformIBAN(value: string): string {
        return value.slice(0, -4).replace(/[^\s]/g, '*') + value.slice(-4);
    }

    private transformString(value: string): string {
        if (value.length <= 1) return '***';
        return value.length > 2
            ? `***${value.slice(value.length - 2, value.length)}`
            : `***${value[1]}`;
    }
}
