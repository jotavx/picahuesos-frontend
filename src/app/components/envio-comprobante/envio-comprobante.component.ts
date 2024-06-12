import { Component, Inject, OnInit } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ConfirmEnviadosDialogComponent } from '../confirm-enviados-dialog/confirm-enviados-dialog.component';

interface ComprobantesEnviados {
  inscripcion: boolean;
  [key: string]: boolean;
}

@Component({
  selector: 'app-envio-comprobante',
  templateUrl: './envio-comprobante.component.html',
  styleUrls: ['./envio-comprobante.component.css'],
})
export class EnvioComprobanteComponent implements OnInit {
  alumnoNombre: string = '';
  alumnoEmail: string = '';
  inscripcion: number = 0;
  mesGuardado: { [mes: string]: boolean } = {};
  valoresMes: { [mes: string]: number } = {};
  mesesSeleccionados: { [mes: string]: boolean } = {};
  comprobantesEnviados: ComprobantesEnviados = { inscripcion: false };
  incluyeInscripcion: boolean = false;

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

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<EnvioComprobanteComponent>,
    public dialog: MatDialog, /////////////////////////////////////// NEW
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.alumnoService.getAlumno(this.data.id).subscribe((resultado) => {
      const alumno = resultado.payload.data();
      this.alumnoNombre = alumno.nombre;
      this.alumnoEmail = alumno.email;
      this.inscripcion = alumno.montoInsc;
      this.comprobantesEnviados = alumno.comprobantesEnviados || {
        inscripcion: false,
      };
      this.meses.forEach((mes) => {
        this.mesesSeleccionados[mes] = false;
        this.valoresMes[mes] = alumno[`mes${mes}`];
        this.comprobantesEnviados[mes] =
          this.comprobantesEnviados[mes] || false;
      });
    });
  }

  /////////////////////////////////////// NEW
  confirmarEliminacionComprobante(mes: string): void {
    const dialogRef = this.dialog.open(ConfirmEnviadosDialogComponent, {
      width: '450px',
      data: { mes },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.eliminarComprobante(mes);
      }
    });
  }

  // Method to delete the comprobante
  eliminarComprobante(mes: string): void {
    this.alumnoService
      .actualizarComprobanteEnviado(this.data.id, mes, false)
      .then(() => {
        this.toastr.success(
          `Comprobante de ${mes} eliminado exitosamente.`,
          'Eliminación Exitosa',
          {
            positionClass: 'toast-bottom-right',
          }
        );

        this.comprobantesEnviados[mes] = false; // Update the local state
      })
      .catch((error) => {
        this.toastr.error(
          'Se ha producido un error al eliminar el comprobante.',
          'Error de Eliminación',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      });
  }
  /////////////////////////////////////// NEW

  actualizarMontoMes(mes: string, monto: number): void {
    this.alumnoService.actualizarMontoMes(this.data.id, mes, monto).then(
      () => {
        this.mesGuardado[mes] = true;
      },
      (error) => {
        this.toastr.error(
          `Error al actualizar el monto para ${mes}.`,
          'Error de Actualización',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      }
    );
  }
  enviarCorreoComprobante() {
    const alMenosUnMesSeleccionado = Object.values(
      this.mesesSeleccionados
    ).some((mes) => mes);
    const inscripcionSeleccionada = this.incluyeInscripcion;

    if (!alMenosUnMesSeleccionado && !inscripcionSeleccionada) {
      this.toastr.error(
        'Debes seleccionar al menos un mes o la inscripción para enviar el comprobante.',
        'Se ha producido un error',
        { positionClass: 'toast-bottom-right' }
      );
      return;
    }

    let todosLosMontosValidos = true;

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

    if (!todosLosMontosValidos) {
      this.toastr.error(
        'Algunos de los meses seleccionados no tienen un monto válido.',
        'Se ha producido un error',
        {
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }

    if (this.incluyeInscripcion && this.comprobantesEnviados.inscripcion) {
      this.toastr.warning(
        'El comprobante de inscripción ya ha sido enviado.',
        'Advertencia',
        { positionClass: 'toast-bottom-right' }
      );
      return;
    }

    // Verificar si algún mes seleccionado ya tiene un comprobante enviado
    const mesesConComprobantesEnviados = this.meses.filter(
      (mes) => this.mesesSeleccionados[mes] && this.comprobantesEnviados[mes]
    );

    if (mesesConComprobantesEnviados.length > 0) {
      this.toastr.warning(
        `El comprobante de pago para ${mesesConComprobantesEnviados.join(
          ', '
        )} ya ha sido enviado.`,
        'Advertencia',
        { positionClass: 'toast-bottom-right' }
      );
      return;
    }

    const email = this.alumnoEmail;
    let mensaje = 'Hola. ';

    if (this.incluyeInscripcion) {
      mensaje += `Se ha registrado el pago de inscripción anual. \nIMPORTE ABONADO: ${this.inscripcion}\n\n`;
    }

    const mesesEnviados: any = [];
    this.meses.forEach((mes) => {
      if (this.mesesSeleccionados[mes]) {
        mensaje += `Se ha registrado el pago de tu cuota del mes de ${mes}. \nIMPORTE ABONADO: ${this.valoresMes[mes]}\n\n`;
        mesesEnviados.push(mes);
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
          const mesesEnviadosStr = mesesEnviados.join(', ');
          this.toastr.success(
            `Se ha enviado correctamente el comprobante para ${this.alumnoNombre}.`,
            'Email de Pago Registrado',
            { positionClass: 'toast-bottom-right' }
          );
          this.guardarComprobantes();
        } else {
          this.toastr.error(
            'Se ha producido un error, verifique el email del Alumno/a',
            'Email de Comprobante de Pago',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Se ha producido un error',
          'Email de Comprobante de Pago',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      }
    );
    this.dialogRef.close();
  }

  guardarComprobantes() {
    if (this.incluyeInscripcion) {
      this.alumnoService.actualizarComprobanteEnviado(
        this.data.id,
        'inscripcion',
        true
      );
    }

    this.meses.forEach((mes) => {
      if (this.mesesSeleccionados[mes]) {
        this.alumnoService.actualizarComprobanteEnviado(
          this.data.id,
          mes,
          true
        );
      }
    });
    this.guardarMeses();
  }

  guardarMeses() {
    // Guardar los datos de los meses en la base de datos
    Object.keys(this.mesesSeleccionados).forEach((mes) => {
      if (this.mesesSeleccionados[mes]) {
        this.alumnoService
          .actualizarMontoMes(this.data.id, mes, this.valoresMes[mes])
          .then(
            (resp) => {
              console.log(resp);
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }
}
