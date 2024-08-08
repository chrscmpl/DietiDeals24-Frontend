import { CurrencyPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'findCurrency',
    standalone: true,
})
export class FindCurrencyPipe implements PipeTransform {
    private readonly currencyPipe: CurrencyPipe;
    public constructor(@Inject(LOCALE_ID) public readonly locale: string) {
        this.currencyPipe = new CurrencyPipe(locale);
    }

    public transform(value: string): string {
        return value.replace(
            /CURRENCY{([^}|]+)\|([^}]+)}/g,
            (_, amount, currency) =>
                this.currencyPipe.transform(amount, currency) ??
                `${amount}${currency}`,
        );
    }
}
