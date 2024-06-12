export interface Reminder {
  id: string;
  reminderTitle: string;
  reminderDate: Date;
  reminderDescription: string;
  fechaCreacion: Date;
  isVisible?: boolean;
}
