import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  status: boolean = false;
  message: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.get('email')?.value;
      this.userService
        .resetPassword(email)
        .then(() => {
          this.status = true;
          setTimeout(() => {
            this.route.navigate(['/login']);
          }, 2000);
        })
        .catch((error) => {
          this.message = 'Ha ocurrido un error. Por favor, inténtelo de nuevo.';
        });
    }
  }
}
