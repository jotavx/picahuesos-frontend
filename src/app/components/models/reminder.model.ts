export interface Reminder {
  id: string; // o number, según tu diseño de base de datos
  reminderTitle: string;
  reminderDate: Date;
  reminderDescription: string;
  fechaCreacion: Date;
  isVisible?: boolean; // Propiedad opcional para controlar la visibilidad
}
