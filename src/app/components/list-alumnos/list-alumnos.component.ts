import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as XLSX from 'xlsx';
import { CreateAlumnComponent } from '../create-alumn/create-alumn.component';
import { EnvioComprobanteComponent } from '../envio-comprobante/envio-comprobante.component';
import { ConfirmBajaDialogComponent } from '../confirm-baja-dialog/confirm-baja-dialog.component';
import { EnvioEmailDialogComponent } from '../envio-email-dialog/envio-email-dialog.component';
import { UserService } from 'src/services/user.service';
import { ConfigDialogComponent } from '../config-dialog/config-dialog.component';
import { Alumno } from 'src/app/models/alumno.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list-alumnos',
  templateUrl: './list-alumnos.component.html',
  styleUrls: ['./list-alumnos.component.css'],
})
export class ListAlumnosComponent implements OnInit {
  timeOut: boolean = false;
  selectedCategory: string = 'Mosquitos'; // Para filtrar alumnos por categoría.
  fileName = 'ExcelSheet.xlsx'; // Nombre del archivo Excel a exportar.
  alumnos: Alumno[] = []; // Array que almacena la información de los alumnos.
  displayedColumns: string[] = [
    'acciones',
    'nombre',
    'mesAbonado',
    'dni',
    'fechaNacimiento',
    'categoria',
    'direccion',
    'email',
    'seguroAltaBaja',
    'aptoMedico',
    'telefono',
    'tutoresResponsables',
    'permisoImagen',
    'seRetiraSolo',
    'quienRetira',
  ]; // Columnas a mostrar en la tabla.
  dataSource = new MatTableDataSource<Alumno>(); // Instancia de MatTableDataSource.
  selectedAlumnos: Set<string> = new Set<string>();

  private categoryChange$ = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private alumnoService: AlumnoService,
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoryChange$
      .pipe(
        switchMap((category) =>
          this.alumnoService.getAlumnosPorCategoria(category)
        )
      )
      .subscribe(
        (data) => {
          this.alumnos = data.map((element: any) => ({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          }));
          this.dataSource.data = this.alumnos;
        },
        (error) => console.log(error)
      );

    this.filtrarPorCategoria(this.selectedCategory); // Filtra inicialmente por la categoría 'Mosquitos'.
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleSelection(id: string): void {
    this.selectedAlumnos.has(id)
      ? this.selectedAlumnos.delete(id)
      : this.selectedAlumnos.add(id);
  }

  toggleSelectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.dataSource.filteredData.forEach((row) =>
        this.selectedAlumnos.add(row.id)
      );
    } else {
      this.selectedAlumnos.clear();
    }
  }

  isSelected(id: string): boolean {
    return this.selectedAlumnos.has(id);
  }

  exportExcelSelection(): void {
    const selectedData = this.alumnos.filter((alumno) =>
      this.isSelected(alumno.id)
    );

    if (selectedData.length === 0) {
      this.toastr.error(
        'Debe seleccionar al menos un alumno',
        'Se ha producido un error',
        { positionClass: 'toast-bottom-right' }
      );
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      selectedData.map((alumno) => ({
        'Nombre Completo': alumno.nombre,
        'Mes Abonado': alumno.mesAbonado,
        DNI: alumno.dni,
        'Fecha de Nacimiento': alumno.fechaNacimiento,
        Categoria: alumno.categoria,
        Dirección: alumno.direccion,
        Email: alumno.email,
        Seguro: alumno.seguroAltaBaja,
        Teléfono: alumno.telefono,
        'Tutores Responsables': alumno.tutoresResponsables,
        'Permiso de imagen': alumno.permisoImagen,
        'Se retira solx': alumno.seRetiraSolo,
        'Quien Retira': alumno.quienRetira,
        'Apto Medico': alumno.aptoMedico,
      }))
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos Seleccionados');
    XLSX.writeFile(wb, 'Alumnos_Seleccionados.xlsx');
    this.selectedAlumnos.clear();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportExcel(): void {
    const data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  getColorForFechaAbonado(fechaAbonado: Date): string {
    const hoy = new Date();
    const fechaAbonadoPlus30Days = new Date(fechaAbonado);
    fechaAbonadoPlus30Days.setDate(fechaAbonadoPlus30Days.getDate() + 30);

    return hoy > fechaAbonadoPlus30Days ? '#8D2511' : '#376D06';
  }

  filtrarPorCategoria(categoria: string): void {
    this.selectedCategory = categoria;
    this.categoryChange$.next(categoria);
  }

  openDeleteDialog(alumnoId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.eliminarAlumno(alumnoId);
      }
    });
  }

  openBajaDialog(alumnoId: string): void {
    const dialogRef = this.dialog.open(ConfirmBajaDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.moverAlumnoABajas(alumnoId);
      }
    });
  }

  openConfigDialog(): void {
    this.dialog.open(ConfigDialogComponent, { width: '450px' });
  }

  eliminarAlumno(id: string): void {
    this.alumnoService
      .eliminarAlumno(id)
      .then(() =>
        this.handleSuccess(
          'El alumno/a fue eliminado con éxito',
          'Registro Eliminado'
        )
      )
      .catch(() => this.handleError('Acción fallida'));
  }

  openCreateDialog(row?: Alumno): void {
    const dialogRef = this.dialog.open(CreateAlumnComponent, {
      width: '1200px',
      data: row,
    });
    dialogRef
      .afterClosed()
      .subscribe(() => this.filtrarPorCategoria(this.selectedCategory));
  }

  openEmailDialog(id: string): void {
    this.dialog.open(EnvioComprobanteComponent, {
      data: { id },
      width: '600px',
    });
  }

  moverAlumnoABajas(id: string): void {
    this.alumnoService
      .moverAlumnoABajas(id)
      .then(() =>
        this.handleSuccess(
          'Puede visualizar el registro en la sección de bajas',
          'Acción realizada'
        )
      )
      .catch(() => this.handleError('Acción fallida'));
  }

  openEnvioEmail(): void {
    this.dialog.open(EnvioEmailDialogComponent, { width: '1200px' });
  }

  reiniciarServidor(): void {
    this.setThisTimeOut();
    const correoParams = {
      email: 'jvcode7@gmail.com',
      asunto: 'Servidor Inicializado',
      mensaje: 'Se ha iniciado correctamente.',
    };

    this.userService.enviarCorreo(correoParams).subscribe(
      (resp) => {
        if (resp && resp.ok === true) {
          this.handleSuccess(
            'El envío de email se encuentra disponible',
            'Servidor Inicializado'
          );
        } else {
          this.handleError('Error al inicializar el servidor');
        }
      },
      () => this.handleError('Error al inicializar el servidor')
    );
  }

  private handleSuccess(message: string, title: string): void {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-right',
    });
  }

  private handleError(message: string): void {
    this.toastr.error(
      'Si el error persiste, comunicarse con el soporte de la aplicación',
      message,
      { positionClass: 'toast-bottom-right' }
    );
  }

  private setThisTimeOut(): void {
    this.timeOut = true;
    setTimeout(() => {
      this.timeOut = false;
    }, 78000);
  }
}
