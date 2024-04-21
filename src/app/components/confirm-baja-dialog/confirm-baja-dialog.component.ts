import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-baja-dialog',
  templateUrl: './confirm-baja-dialog.component.html',
  styleUrls: ['./confirm-baja-dialog.component.css'],
})
export class ConfirmBajaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmBajaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmarBaja(): void {
    this.dialogRef.close('confirm');
  }
}
