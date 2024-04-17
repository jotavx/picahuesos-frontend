import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReminderService } from 'src/services/reminder.service';
import { ReminderDialogComponent } from '../reminder-dialog/reminder-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Reminder } from '../models/reminder.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isVisible = true;
  datosReminder: any = [];
  constructor(
    public dialog: MatDialog,
    private reminderService: ReminderService
  ) {}

  ngOnInit(): void {
    this.getReminderData();
  }

  getReminderData() {
    this.reminderService.getData().subscribe((data) => {
      this.datosReminder = data.map((element: any) => ({
        id: element.payload.doc.id,
        isVisible: true, // Asegúrate de que esta propiedad se establece en true inicialmente
        ...element.payload.doc.data(),
      }));
    });
  }

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

  openReminderDialog(content?: any): void {
    const dialogRef = this.dialog.open(ReminderDialogComponent, {
      width: '900px',
      data: content, // pasar datos a través del diálogo si estás en modo de edición
    });
  }

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
