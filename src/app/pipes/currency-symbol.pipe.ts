import { getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencySymbol',
    standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
    transform(value: string): string {
        return getCurrencySymbol(value, 'narrow');
    }
}
