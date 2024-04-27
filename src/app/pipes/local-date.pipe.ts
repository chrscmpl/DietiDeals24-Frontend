import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: string | number | Date): string | null {
    const date = new Date(value);
    const dayDifference = this.dayDifference(date);
    if (dayDifference < 0) {
      return this.datePipe.transform(date, 'dd/MM/yyyy');
    }
    if (dayDifference === 0) {
      return this.datePipe.transform(date, "'today at' HH:mm");
    } else if (dayDifference < 7) {
      return this.datePipe.transform(date, "EEEE 'at' HH:mm");
    } else {
      return this.datePipe.transform(date, "EEEE dd/MM/yyyy 'at' HH:mm");
    }
  }

  private dayDifference(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
