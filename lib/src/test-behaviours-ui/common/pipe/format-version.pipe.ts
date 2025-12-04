import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versionFormat',
  standalone: false,
})
export class VersionFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    const strValue = value.toString().trim();
    const parts = value.toString().split('.');
    while (parts.length < 3) {
      parts.push('0');
    }
    if (strValue.toLowerCase().startsWith('v')) {
      return parts.slice(0, 3).join('.');
    }
    return 'v' + parts.slice(0, 3).join('.');
  }
}
