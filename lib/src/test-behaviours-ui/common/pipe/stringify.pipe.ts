import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringify',
  standalone: false,

})
export class StringifyPipe implements PipeTransform {
  transform(value: any): string {
    return typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : String(value);
  }
}
