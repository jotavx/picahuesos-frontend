import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): any {
    const date = new Date(value + 'T12:00:00'); // Ajuste para la zona horaria
    const day = date.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = date
      .toLocaleDateString('es-ES', { month: 'short' })
      .toUpperCase()
      .replace(/\.$/, '');
    return { day, month };
  }
}
