import { Pipe, PipeTransform } from '@angular/core';

enum Precision {
    'years' = 0,
    'months' = 1,
    'days' = 2,
    'hours' = 3,
    'minutes' = 4,
    'seconds' = 5,
}

interface Interval {
    years?: number;
    months?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

@Pipe({
    name: 'interval',
    standalone: true,
})
export class IntervalPipe implements PipeTransform {
    transform(value: number, precision: string = 'seconds'): string {
        const precisionValue: Precision =
            precision in Precision
                ? Precision[precision as keyof typeof Precision]
                : Precision.seconds;
        if (value <= 0) return 'now';
        const interval = this.getValues(value, precisionValue);
        if (
            interval.years ||
            interval.months ||
            interval.days ||
            precisionValue < Precision.days
        ) {
            return this.buildLongString(interval, precisionValue);
        }
        return this.buildShortString(interval, precisionValue);
    }

    private buildLongString(interval: Interval, precision: Precision) {
        const { years, months, days, hours, minutes, seconds } = interval;
        const ret = [];
        if (years) ret.push(this.pluralize('year', years));
        if ((months || years) && precision >= Precision.months)
            ret.push(this.pluralize('month', months));
        if (precision >= Precision.days) ret.push(this.pluralize('day', days));
        if (precision >= Precision.hours)
            ret.push(this.pluralize('hour', hours));
        if (precision >= Precision.minutes)
            ret.push(this.pluralize('minute', minutes));
        if (precision >= Precision.seconds)
            ret.push(this.pluralize('second', seconds));
        return ret.filter((s) => s.length).join(', ');
    }

    private buildShortString(interval: Interval, precision: Precision) {
        const { hours, minutes, seconds } = interval;
        const ret = [];
        ret.push(this.formatNumber(hours));
        if (precision >= Precision.minutes)
            ret.push(this.formatNumber(minutes));
        if (precision >= Precision.seconds)
            ret.push(this.formatNumber(seconds));
        return ret.join(':');
    }

    private getValues(value: number, precision: Precision): Interval {
        const ret: Interval = {};
        ret.years = Math.floor(value / 31536000);
        if (precision === Precision.years) return ret;
        value %= 31536000;
        ret.months = Math.floor(value / 2592000);
        if (precision === Precision.months) return ret;
        value %= 2592000;
        ret.days = Math.floor(value / 86400);
        if (precision === Precision.days) return ret;
        value %= 86400;
        ret.hours = Math.floor(value / 3600);
        if (precision === Precision.hours) return ret;
        value %= 3600;
        ret.minutes = Math.floor(value / 60);
        if (precision === Precision.minutes) return ret;
        ret.seconds = value % 60;
        return ret;
    }

    private pluralize(unit: string, value?: number): string {
        if (!value) return '';
        return `${value} ${unit}${value !== 1 ? 's' : ''}`;
    }

    private formatNumber(num?: number): string {
        num = num ?? 0;
        return num < 10 ? `0${num}` : num.toString();
    }
}
