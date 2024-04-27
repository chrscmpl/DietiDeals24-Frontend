import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oneCharUpper',
  standalone: true,
})
export class OneCharUpperPipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
