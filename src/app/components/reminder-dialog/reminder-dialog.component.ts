import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReminderService } from 'src/services/reminder.service';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: './reminder-dialog.component.html',
  styleUrls: ['./reminder-dialog.component.css'],
})
export class ReminderDialogComponent implements OnInit {
  titulo = 'Crear Recordatorio';
  loading = false;
  submitted = false;
  createReminder: FormGroup;
  id: string | null;
  constructor(
    private dialogRef: MatDialogRef<ReminderDialogComponent>,
    private reminderService: ReminderService,
    private fb: FormBuilder,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createReminder = this.fb.group({
      reminderTitle: ['', Validators.required],
      reminderDate: ['', Validators.required],
      reminderDescription: [
        '',
        [Validators.required, Validators.maxLength(90)],
      ],
      fechaCreacion: new Date(),
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.forEdit();
  }

  buildReminder() {
    const content = this.createReminder.value;
    this.loading = true;
    this.reminderService
      .buildContent(content)
      .then(() => {
        console.log('El registro se completo correctamente');
        this.loading = false;
        this.dialogRef.close();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editReminder(id: string) {
    const content: any = {
      reminderTitle: this.createReminder.value.reminderTitle,
      reminderDate: this.createReminder.value.reminderDate,
      reminderDescription: this.createReminder.value.reminderDescription,
    };
    this.loading = true;
    this.reminderService
      .editContent(id, content)
      .then((resp) => {
        console.log(resp);
        this.loading = false;
        this.dialogRef.close();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  buildOrEditReminder() {
    this.submitted = true;
    if (this.createReminder.invalid) {
      return;
    }

    if (this.data) {
      this.editReminder(this.data.id);
    } else {
      this.buildReminder();
    }
  }

  forEdit() {
    if (this.data) {
      this.createReminder.patchValue({
        reminderTitle: this.data.reminderTitle,
        reminderDate: this.data.reminderDate,
        reminderDescription: this.data.reminderDescription,
      });
      this.titulo = 'Editar Recordatorio';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
