import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReminderService } from 'src/services/reminder.service';
import { ReminderDialogComponent } from '../reminder-dialog/reminder-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Reminder } from '../../models/reminder.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isVisible = true; //booleano utilizado para controlar la visibilidad de los recordatorios
  datosReminder: Reminder[] = []; //arreglo para almacenar los datos de los recordatorios recibidos del servicio
  constructor(
    public dialog: MatDialog,
    private reminderService: ReminderService
  ) {}

  ngOnInit(): void {
    this.getReminderData();
  }

  //Este método obtiene los datos de los recordatorios desde el servicio y los transforma para ser utilizados en el componente, asegurando que cada recordatorio tenga un ID y una propiedad isVisible.
  getReminderData() {
    this.reminderService.getData().subscribe((data) => {
      this.datosReminder = data.map((element: any) => ({
        id: element.payload.doc.id,
        isVisible: true, // Asegúrate de que esta propiedad se establece en true inicialmente
        ...element.payload.doc.data(),
      }));
    });
  }

  //  Elimina un recordatorio específico utilizando su ID y luego vuelve a cargar los datos.
  deleteContent(id: string): void {
    this.reminderService
      .deleteContent(id)
      .then(() => {
        console.log('El elemento se eliminó correctamente');
        this.getReminderData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Abre un diálogo modal para editar o añadir un recordatorio. Si se pasa content, se utilizará para la edición.
  openReminderDialog(content?: any): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '900px',
      data: content, // pasar datos a través del diálogo si estás en modo de edición
    });
  }

  //Abre un diálogo de confirmación antes de proceder a eliminar un recordatorio. Si el resultado es 'confirm', se elimina el recordatorio.
  openDeleteDialog(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.deleteContent(id);
      }
    });
  }

  //Cambia la visibilidad de un recordatorio en la UI sin eliminarlo del almacenamiento, estableciendo isVisible a false.
  closeReminder(id: string): void {
    this.datosReminder = this.datosReminder.map((r: Reminder) => {
      if (r.id === id) {
        // Aquí se corrige 'reminderId' por 'id'
        r.isVisible = false;
      }
      return r;
    });
  }
}
