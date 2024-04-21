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
  // Variables para almacenar información del alumno y el monto de inscripción.
  alumnoNombre: string = '';
  alumnoEmail: string = '';
  inscripcion: number = 0;
  //Array que contiene los meses del año para los que se puede registrar un pago.
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
  valoresMes: { [mes: string]: number } = {}; //Un objeto que mapea cada mes a un valor numérico de pago.
  mesesSeleccionados: { [mes: string]: boolean } = {}; // Un objeto para rastrear qué meses han sido seleccionados para el pago.
  incluyeInscripcion: boolean = false; //Booleano para saber si se incluye el pago de la inscripción en el comprobante.

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<EnvioComprobanteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Realiza una llamada al servicio AlumnoService para obtener los datos del alumno. Se suscribe a la respuesta y maneja los datos del alumno, ajustando los estados valoresMes y mesesSeleccionados

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
    // Crea un mensaje de correo electrónico listando todos los pagos registrados por mes y para la inscripción, si corresponde.
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

    //Utiliza UserService para enviar el correo electrónico, suscribiéndose al resultado y mostrando una notificación de éxito o error según el caso
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
    //Finalmente, cierra el diálogo una vez que el correo es enviado o si se encuentra un error.
  }
}
