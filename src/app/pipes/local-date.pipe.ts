import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'localDate',
    standalone: true,
})
export class LocalDatePipe implements PipeTransform {
    private datePipe: DatePipe;
    constructor(@Inject(LOCALE_ID) public readonly locale: string) {
        this.datePipe = new DatePipe(locale);
    }
    transform(value: string | number | Date): string | null {
        const date = new Date(value);
        const dayDifference = this.dayDifference(date);
        if (dayDifference < 0) {
            return this.datePipe.transform(date, 'dd/MM/yyyy');
        }
        if (dayDifference === 0) {
            return this.datePipe.transform(date, "'today at' HH:mm");
        } else if (dayDifference <= 1) {
            return this.datePipe.transform(date, "'tomorrow at' HH:mm");
        } else if (dayDifference < 7) {
            return this.datePipe.transform(date, "EEEE 'at' HH:mm");
        } else {
            return this.datePipe.transform(date, "EEEE dd/MM/yyyy 'at' HH:mm");
        }
    }

    private dayDifference(date: Date): number {
        const today = new Date().setHours(0, 0, 0, 0);
        const otherDay = new Date(date).setHours(0, 0, 0, 0);
        return (otherDay - today) / (1000 * 60 * 60 * 24);
    }
}
