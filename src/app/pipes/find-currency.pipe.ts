import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'findCurrency',
    standalone: true,
})
export class FindCurrencyPipe implements PipeTransform {
    constructor(private readonly currencyPipe: CurrencyPipe) {}

    transform(value: string): string {
        return value.replace(
            /CURRENCY{([^}|]+)\|([^}]+)}/g,
            (_, amount, currency) =>
                this.currencyPipe.transform(amount, currency) ??
                `${amount}${currency}`,
        );
    }
}
