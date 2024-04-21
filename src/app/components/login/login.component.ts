import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginError = false; //variable booleana que indica si hay un error de inicio de sesión.
  formLogin: FormGroup; //instancia de FormGroup para manejar el formulario de inicio de sesión,
  hide = true; //variable booleana utilizada para controlar la visibilidad de la contraseña en la interfaz de usuario.

  constructor(
    private userService: UserService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }); //Inicializa formLogin con email y password, ambos con validaciones requeridas.
  }

  onSubmit() {
    this.userService
      .login(this.formLogin.value)
      .then((response) => {
        //Se agrega la persistencia session para que al cerrar la pestaña o el navegador cierra la sesión
        this.afAuth.setPersistence('session').then(() => {});
        this.router.navigate(['/home']); //navega hasta el inicio del sitio
        // this.envioStart(); //Llamar a la funcion para inicializar el servidor de envio de emails
      })
      .catch((error) => {
        this.loginError = true;
      });
  }

  // Se utiliza para inicializar el servidor de envio de email
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
          console.log('Se ha inicializado el servidor correctamente', resp);
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
