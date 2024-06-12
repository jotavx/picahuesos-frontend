import { Pipe, PipeTransform } from '@angular/core';
import { Reminder } from '../models/reminder.model';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Reminder): { day: string; month: string } {
    // Extraer la fecha de la interfaz Reminder
    const date = new Date(value.reminderDate + 'T12:00:00'); // Ajuste para la zona horaria

    // Formatear la fecha y obtener el día y el mes
    const day = date.toLocaleDateString('es-ES', { day: 'numeric' });
    const month = date
      .toLocaleDateString('es-ES', { month: 'short' })
      .toUpperCase()
      .replace(/\.$/, '');

    // Devolver un objeto con día y mes formateados
    return { day, month };
  }
}
