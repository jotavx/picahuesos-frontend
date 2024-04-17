import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/services/alumno.service';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionAlumnosDialogComponent } from '../seleccion-alumnos-dialog/seleccion-alumnos-dialog.component';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrls: ['./envio-email.component.css'],
  providers: [UserService],
})
export class EnvioEmailComponent {
  listaCorreosSeleccionada: string = '';

  listaCorreosMosquitos: string = '';
  listaCorreosPMM: string = '';
  listaCorreosPreMini: string = '';
  listaCorreosMini: string = '';
  listaCorreosU13: string = '';
  listaCorreosU15: string = '';
  listaCorreosU17: string = '';
  listaCorreosPrimera: string = '';

  listaCorreos: string = '';

  alumnos: any[] = [];
  datosCorreo: FormGroup;
  loading = false;

  constructor(
    private _alumnoService: AlumnoService,
    private httpclient: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.datosCorreo = new FormGroup({
      correo: new FormControl('', Validators.email),
      asunto: new FormControl('', Validators.required),
      mensaje: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getCorreos();
  }

  getCorreos() {
    this._alumnoService.getAlumnos().subscribe((data) => {
      this.alumnos = [];
      data.forEach((element: any) => {
        this.alumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.listaCorreos = this.alumnos.map((alumno) => alumno.email).join(', ');

      const alumnosCategoriaMosquitos = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Mosquitos'
      );
      this.listaCorreosMosquitos = alumnosCategoriaMosquitos
        .map((alumno) => alumno.email)
        .join(', ');
      const alumnosCategoriaPMM = this.alumnos.filter(
        (alumno) => alumno.categoria === 'PMM'
      );
      this.listaCorreosPMM = alumnosCategoriaPMM
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaPreMini = this.alumnos.filter(
        (alumno) => alumno.categoria === 'PreMini'
      );
      this.listaCorreosPreMini = alumnosCategoriaPreMini
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaMini = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Mini'
      );
      this.listaCorreosMini = alumnosCategoriaMini
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaU13 = this.alumnos.filter(
        (alumno) => alumno.categoria === 'U13'
      );
      this.listaCorreosU13 = alumnosCategoriaU13
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaU15 = this.alumnos.filter(
        (alumno) => alumno.categoria === 'U15'
      );
      this.listaCorreosU15 = alumnosCategoriaU15
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaU17 = this.alumnos.filter(
        (alumno) => alumno.categoria === 'U17'
      );
      this.listaCorreosU17 = alumnosCategoriaU17
        .map((alumno) => alumno.email)
        .join(', ');

      const alumnosCategoriaPrimera = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Primera'
      );
      this.listaCorreosPrimera = alumnosCategoriaPrimera
        .map((alumno) => alumno.email)
        .join(', ');
    });
  }

  seleccionarDestinatarios(opcion: string) {
    if (opcion === 'todos') {
      this.listaCorreosSeleccionada = this.listaCorreos;
    } else if (opcion === 'mosquitos') {
      this.listaCorreosSeleccionada = this.listaCorreosMosquitos;
    } else if (opcion === 'PMM') {
      this.listaCorreosSeleccionada = this.listaCorreosPMM;
    } else if (opcion === 'PreMini') {
      this.listaCorreosSeleccionada = this.listaCorreosPreMini;
    } else if (opcion === 'Mini') {
      this.listaCorreosSeleccionada = this.listaCorreosMini;
    } else if (opcion === 'U13') {
      this.listaCorreosSeleccionada = this.listaCorreosU13;
    } else if (opcion === 'U15') {
      this.listaCorreosSeleccionada = this.listaCorreosU15;
    } else if (opcion === 'U17') {
      this.listaCorreosSeleccionada = this.listaCorreosU17;
    } else if (opcion === 'Primera') {
      this.listaCorreosSeleccionada = this.listaCorreosPrimera;
    }
  }

  envioCorreo() {
    if (this.datosCorreo.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    let params = {
      email: this.listaCorreosSeleccionada,
      asunto: this.datosCorreo.value.asunto,
      mensaje: this.datosCorreo.value.mensaje,
    };
    this.loading = true;
    this.userService.enviarCorreo(params).subscribe(
      (resp) => {
        // Verificar si la respuesta del servidor tiene ok: true
        if (resp && resp.ok === true) {
          this.toastr.success(
            'El mensaje se envió correctamente',
            'Mensaje Enviado',
            { positionClass: 'toast-bottom-right' }
          );
          this.router.navigate(['/list-alumnos']);
        } else {
          // Mostrar un mensaje de error si ok: false o no hay respuesta
          this.toastr.error('Hubo un error al enviar el mensaje', 'Error', {
            positionClass: 'toast-bottom-right',
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al enviar el mensaje', 'Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loading = false;
      }
    );
  }

  abrirDialogoSeleccionAlumnos(): void {
    const dialogRef = this.dialog.open(SeleccionAlumnosDialogComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe((alumnosSeleccionados: any[]) => {
      if (alumnosSeleccionados && alumnosSeleccionados.length > 0) {
        // Aquí puedes manejar los alumnos seleccionados
        // Por ejemplo, puedes almacenar sus correos en listaCorreosSeleccionada
        this.listaCorreosSeleccionada = alumnosSeleccionados
          .map((alumno) => alumno.email)
          .join(', ');
      }
    });
  }

  limpiarEmails() {
    this.datosCorreo.get('correo')?.setValue('');
  }
}
