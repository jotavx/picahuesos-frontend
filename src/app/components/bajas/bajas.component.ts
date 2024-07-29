import { Component, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Alumno } from 'src/app/models/alumno.model';

@Component({
  selector: 'app-bajas',
  templateUrl: './bajas.component.html',
  styleUrls: ['./bajas.component.css'],
})
export class BajasComponent {
  bajasAlumnos: Alumno[] = []; //Un arreglo que almacenará los datos de alumnos que han sido dados de baja.
  displayedColumns: string[] = [
    'acciones',
    'nombre',
    'dni',
    'fechaNacimiento',
    'categoria',
    'direccion',
    'email',
    'seguroAltaBaja',
    'telefono',
  ];
  dataSource = new MatTableDataSource<Alumno>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getBajasAlumnos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Obtiene los alumnos dados de baja llamando a un método del servicio AlumnoService. Los datos recibidos se procesan y se asignan al dataSource para mostrar en la tabla.
  getBajasAlumnos() {
    this.alumnoService.getBajasAlumnos().subscribe((data) => {
      this.bajasAlumnos = [];
      data.forEach((element: any) => {
        this.bajasAlumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.dataSource.data = this.bajasAlumnos;
    });
  }

  //Este método gestiona la devolución de un alumno a la lista activa desde la lista de bajas, usando el servicio AlumnoService. También maneja la notificación del resultado de esta operación usando ToastrService.
  devolverAlumno(id: string) {
    this.alumnoService
      .devolverAlumnos(id)
      .then(() =>
        this.toastr.success(
          'Puede visualizar el registro en la sección de alumnos',
          'Acción Realizada',
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
