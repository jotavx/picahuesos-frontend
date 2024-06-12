import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService,
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

  async buildReminder() {
    const content = this.createReminder.value;
    this.dialogRef.close();
    try {
      await this.reminderService.buildContent(content);
      this.toastr.success(
        'El recordatorio fue creado con éxito',
        'Recordatorio Creado',
        { positionClass: 'toast-bottom-right' }
      );
    } catch (error) {
      this.toastr.error('Hubo un error al crear el recordatorio', 'Error', {
        positionClass: 'toast-bottom-right',
      });
    }
  }

  async editReminder(id: string) {
    const content: any = {
      reminderTitle: this.createReminder.value.reminderTitle,
      reminderDate: this.createReminder.value.reminderDate,
      reminderDescription: this.createReminder.value.reminderDescription,
    };
    this.dialogRef.close();
    try {
      await this.reminderService.editContent(id, content);
      this.toastr.info(
        'El recordatorio fue modificado con éxito',
        'Recordatorio Modificado',
        { positionClass: 'toast-bottom-right' }
      );
    } catch (error) {
      this.toastr.error('Hubo un error al modificar el recordatorio', 'Error', {
        positionClass: 'toast-bottom-right',
      });
    }
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
