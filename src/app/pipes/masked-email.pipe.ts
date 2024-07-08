import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskedEmail',
    standalone: true,
})
export class MaskedEmailPipe implements PipeTransform {
    transform(value: string): string {
        const email = value.split('@');
        if (email.length !== 2) return value;

        const local: string =
            email[0].length > 2
                ? `${email[0].slice(0, 2)}***`
                : `${email[0][0]}***`;

        return `${local}@${email[1]}`;
    }
}
