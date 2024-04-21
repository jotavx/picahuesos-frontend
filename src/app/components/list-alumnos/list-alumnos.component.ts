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

@Component({
  selector: 'app-list-alumnos',
  templateUrl: './list-alumnos.component.html',
  styleUrls: ['./list-alumnos.component.css'],
})
export class ListAlumnosComponent implements OnInit {
  selectedCategory: string = 'Mosquitos'; // para filtrar alumnos por categoría.
  fileName = 'ExcelSheet.xlsx'; // es el nombre del archivo Excel a exportar.
  alumnos: any[] = []; //es un array que almacena la información de los alumnos recibida del servicio.
  displayedColumns: string[] = [
    'nombreCompleto',
    'dni',
    'fechaNacimiento',
    // 'categoria',
    'direccion',
    'email',
    'seguroAltaBaja',
    'telefono',
    'tutoresResponsables',
    // 'observacionesAlumno',
    'permisoImagen',
    'seRetiraSolo',
    'mesAbonado',
    'acciones',
  ]; //array que define las columnas a mostrar en la tabla.
  dataSource = new MatTableDataSource<any>(); // instancia de MatTableDataSource para manejar los datos de la tabla de forma reactiva.
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _alumnoService: AlumnoService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filtrarPorCategoria('Mosquitos'); //aquí se filtra inicialmente por la categoría 'Mosquitos'.
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // se ejecuta después de que la vista del componente se haya inicializado completamente, aquí se asignan el paginador y la ordenación a dataSource
  }

  //filtra los datos de la tabla según el texto ingresado por el usuario.
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //exporta los datos de la tabla a un archivo Excel.
  exportExcel() {
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  //determina el color basado en si la fecha de abono ha pasado 30 días o no.
  getColorForFechaAbonado(fechaAbonado: Date): string {
    const hoy = new Date();
    const fechaAbonadoPlus30Days = new Date(fechaAbonado);
    fechaAbonadoPlus30Days.setDate(fechaAbonadoPlus30Days.getDate() + 30);

    if (hoy > fechaAbonadoPlus30Days) {
      return '#8D2511'; // Si han pasado más de 30 días, devolvemos rojo
    } else {
      return '#376D06'; // Si está dentro de los 30 días, devolvemos verde
    }
  }

  //actualiza selectedCategory y carga los alumnos de esa categoría desde AlumnoService
  filtrarPorCategoria(categoria: string): void {
    this.selectedCategory = categoria;
    // sessionStorage.setItem('selectedCategory', categoria);
    this._alumnoService.getAlumnosPorCategoria(categoria).subscribe((data) => {
      this.alumnos = [];
      data.forEach((element: any) => {
        this.alumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.dataSource.data = this.alumnos;
    });
  }

  //abre un diálogo de confirmación para eliminar un alumno.
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

  //elimina un alumno usando AlumnoService.
  eliminarAlumno(id: string) {
    this._alumnoService
      .eliminarAlumno(id)
      .then(() => {
        this.toastr.error(
          'El alumno/a fue eliminado con éxito',
          'Registro Eliminado',
          { positionClass: 'toast-bottom-right' }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //abre un diálogo para crear o editar un alumno.
  openCreateDialog(row?: any): void {
    const dialogRef = this.dialog.open(CreateAlumnComponent, {
      width: '1200px',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.filtrarPorCategoria(this.selectedCategory);
    });
  }

  //abre un diálogo para enviar un comprobante por correo electrónico.
  openEmailDialog(id: string) {
    this.dialog.open(EnvioComprobanteComponent, {
      data: {
        id: id,
      },
    });
  }

  //mueve un alumno a la sección de bajas y muestra una notificación correspondiente.
  moverAlumnoABajas(id: string) {
    this._alumnoService
      .moverAlumnoABajas(id)
      .then(() =>
        this.toastr.success(
          'Puede visualizar el registro en la sección de bajas',
          'Acción realizada',
          { positionClass: 'toast-bottom-right' }
        )
      )
      .catch((error) =>
        this.toastr.error('Acción fallida', 'Se ha producido un error', {
          positionClass: 'toast-bottom-right',
        })
      );
  }
}
