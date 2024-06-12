import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-config-dialog',
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.css'],
})
export class ConfigDialogComponent {
  servers: any[] = [];
  selectedServerUrl: string;

  constructor(private userService: UserService, private toastr: ToastrService) {
    this.selectedServerUrl = this.userService.getBaseUrl();
  }

  ngOnInit() {
    this.getServidores();
  }

  changeServer() {
    try {
      this.userService.setBaseUrl(this.selectedServerUrl);
      const serverName = this.servers.find(
        (server) => server.url === this.selectedServerUrl
      )?.name;
      if (serverName) {
        // this.toastr.success(`Se ha cambiado al ${serverName}`);
        this.toastr.success(
          `Se ha cambiado al ${serverName}`,
          'Servidor Actualizado',
          { positionClass: 'toast-bottom-right' }
        );
      } else {
        this.toastr.error(
          `Se ha producido un error`,
          'Servidor no encontrado',
          { positionClass: 'toast-bottom-right' }
        );
      }
    } catch (error) {
      this.toastr.error(`Se ha producido un error`, 'Servidor no encontrado', {
        positionClass: 'toast-bottom-right',
      });
    }
    this.envioStart();
  }

  getServidores() {
    this.userService.getServidores().subscribe((data) => {
      this.servers = [];
      data.forEach((element: any) => {
        this.servers.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  envioStart() {
    const correoParams = {
      email: 'jvcode7@gmail.com', // Destinatario
      asunto: 'Servidor Inicializado',
      mensaje: 'Se ha iniciado correctamente.',
    };
    this.userService.enviarCorreo(correoParams).subscribe(
      (resp) => {
        // Verificar si la respuesta del servidor tiene ok: true
        if (resp && resp.ok === true) {
          this.toastr.success(
            'El envío de email se encuentra disponible',
            'Servidor Inicializado',
            { positionClass: 'toast-bottom-right' }
          );
        } else {
          this.toastr.error(
            'Si el error persiste, comunicarse con el soporte de la aplicación',
            'Error al inicializar el servidor',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Si el error persiste, comunicarse con el soporte de la aplicación',
          'Error al inicializar el servidor',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      }
    );
  }
}
