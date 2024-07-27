import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'masked',
    standalone: true,
})
export class MaskedPipe implements PipeTransform {
    public transform(
        value: string,
        type: 'email' | 'string' = 'string',
    ): string {
        if (type === 'email') return this.transformEmail(value);
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

    private transformString(value: string): string {
        if (value.length <= 1) return '***';
        return value.length > 2
            ? `***${value.slice(value.length - 2, value.length)}`
            : `***${value[1]}`;
    }
}
