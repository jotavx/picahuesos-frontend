import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginError = false;
  formLogin: FormGroup;
  hide = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.userService
      .login(this.formLogin.value)
      .then((response) => {
        //Se agrega la persistencia session que al cerrar la pestaña o el navegador cierra la sesión
        this.afAuth.setPersistence('session').then(() => {});
        this.router.navigate(['/list-alumnos']);
        // this.envioStart(); //Llamar a la funcion
      })
      .catch((error) => {
        this.loginError = true;
      });
  }

  // Se utiliza para activar el servidor
  envioStart() {
    const correoParams = {
      email: 'jotaviarruel97@gmail.com', // Destinatario
      asunto: 'Servidor Inicializado',
      mensaje: 'Se ha iniciado correctamente.',
    };
    this.userService.enviarCorreo(correoParams).subscribe(
      (resp) => {
        // Verificar si la respuesta del servidor tiene ok: true
        if (resp && resp.ok === true) {
          console.log('Se ha inicializado el servidor', resp);
        } else {
          console.log('Error al inicializar el servidor', resp);
        }
      },
      (error) => {
        console.error('Error al inicializar el servidor', error);
      }
    );
  }
}
