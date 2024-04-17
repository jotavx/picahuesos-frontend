import { Component, Inject, OnInit } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-envio-comprobante',
  templateUrl: './envio-comprobante.component.html',
  styleUrls: ['./envio-comprobante.component.css'],
})
export class EnvioComprobanteComponent implements OnInit {
  alumnoNombre: string = '';
  alumnoEmail: string = '';
  inscripcion: number = 0;
  meses = [
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  valoresMes: { [mes: string]: number } = {};
  mesesSeleccionados: { [mes: string]: boolean } = {};
  incluyeInscripcion: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<EnvioComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.alumnoService.getAlumno(this.data.id).subscribe((resultado) => {
      const alumno = resultado.payload.data();
      this.alumnoNombre = alumno.nombre;
      this.alumnoEmail = alumno.email;
      this.inscripcion = alumno.montoInsc;
      this.meses.forEach((mes) => {
        this.mesesSeleccionados[mes] = false;
        this.valoresMes[mes] = alumno[`mes${mes}`];
      });
    });
  }

  enviarCorreoComprobante() {
    /////////////////////////////////////////////////////////////////////////////////////////NUEVO
    // Bandera para controlar si todos los meses seleccionados tienen monto
    let todosLosMontosValidos = true;

    // Verifica que cada mes seleccionado tenga un monto válido
    this.meses.forEach((mes) => {
      if (
        this.mesesSeleccionados[mes] &&
        (!this.valoresMes[mes] || this.valoresMes[mes] <= 0)
      ) {
        todosLosMontosValidos = false;
      }
    });

    if (
      this.incluyeInscripcion &&
      (!this.inscripcion || this.inscripcion <= 0)
    ) {
      todosLosMontosValidos = false;
    }

    // Si alguno de los montos no es válido, muestra un mensaje de error y detén la ejecución
    if (!todosLosMontosValidos) {
      this.toastr.error(
        'Algunos de los meses seleccionados no tienen un monto válido.',
        'Error',
        {
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    /////////////////////////////////////////////////////////////////////////////////////////NUEVO

    const email = this.alumnoEmail;
    let mensaje = 'Hola Alumnx! \n\n';

    if (this.incluyeInscripcion) {
      mensaje += `Se ha registrado el pago de inscripción anual. \nMonto de inscripción: ${this.inscripcion}\n\n`;
    }

    this.meses.forEach((mes) => {
      if (this.mesesSeleccionados[mes]) {
        mensaje += `Se ha registrado el pago del mes: ${mes}. \nMonto Abono: ${this.valoresMes[mes]}\n\n`;
      }
    });

    mensaje +=
      'Conservar este mail como comprobante de pago.\n\nSaludos.\nPicaHuesos Básquet Club.';

    const correoParams = {
      email: email,
      asunto: 'Pago registrado correctamente',
      mensaje: mensaje,
    };

    this.userService.enviarCorreo(correoParams).subscribe(
      (resp) => {
        if (resp && resp.ok === true) {
          // Mensaje de éxito
          this.toastr.success(
            'Se ha enviado correctamente',
            'Email de Pago Registrado',
            { positionClass: 'toast-bottom-right' }
          );
        } else {
          // Mensaje de error
          this.toastr.error(
            'Se ha producido un error',
            'Email de Pago Registrado',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Se ha producido un error',
          'Email de Pago Registrado',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      }
    );
    this.dialogRef.close();
  }
}
