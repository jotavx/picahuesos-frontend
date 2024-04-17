import { Component } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';

@Component({
  selector: 'app-bajas',
  templateUrl: './bajas.component.html',
  styleUrls: ['./bajas.component.css'],
})
export class BajasComponent {
  alumnos: any[] = [];
  bajasAlumnos: any[] = [];
  constructor(private alumnoService: AlumnoService) {}

  ngOnInit() {
    this.getBajasAlumnos();
  }

  getBajasAlumnos() {
    this.alumnoService.getBajasAlumnos().subscribe((data) => {
      this.bajasAlumnos = [];
      data.forEach((element: any) => {
        this.bajasAlumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  // moverAlumnoABajas(id: string) {
  //   this.alumnoService
  //     .moverAlumnoABajas(id)
  //     .then(() => alert('Alumno movido a bajas correctamente.'))
  //     .catch((error) => console.error('Error al mover al alumno:', error));
  // }

  devolverAlumno(id: string) {
    this.alumnoService
      .devolverAlumnos(id)
      .then(() => alert('Alumno devuelto a la lista de alumnos correctamente.'))
      .catch((error) => console.error('Error al devolver al alumno:', error));
  }
}
