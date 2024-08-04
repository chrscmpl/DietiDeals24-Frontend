import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyDecimalDigits',
    standalone: true,
})
export class CurrencyDecimalDigitsPipe implements PipeTransform {
    private static readonly DEFAULT_DECIMAL_DIGITS = 0;

    transform(value: string): number {
        try {
            return (
                new Intl.NumberFormat(value, {
                    style: 'currency',
                    currency: value,
                })
                    .formatToParts(1)
                    .find((part) => part.type === 'fraction')?.value.length ?? 0
            );
        } catch {
            return CurrencyDecimalDigitsPipe.DEFAULT_DECIMAL_DIGITS;
        }
    }
}
