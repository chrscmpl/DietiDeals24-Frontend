import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Money } from '../models/money.model';

@Pipe({
  name: 'money',
  standalone: true,
})
export class MoneyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}
  transform(value: Money): string | null {
    return this.currencyPipe.transform(value.amount, value.currency);
  }
}
