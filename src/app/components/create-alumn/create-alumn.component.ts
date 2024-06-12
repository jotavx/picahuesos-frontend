import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { AlumnoService } from 'src/services/alumno.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-alumn',
  templateUrl: './create-alumn.component.html',
  styleUrls: ['./create-alumn.component.css'],
})
export class CreateAlumnComponent implements OnInit {
  categorias = [
    'Mosquitos',
    'PMM',
    'PreMini',
    'Mini',
    'U13',
    'U15',
    'U17',
    'Primera',
  ]; //Define las categorías existentes para su selección en el formulario

  titulo = 'Agregar Alumno/a'; // Define un titulo para que sea dinámico, si es editar el titulo sera otro
  submitted = false;
  loading = false;
  id: string | null;

  createAlumno: FormGroup; //FormGroup que representa el formulario para crear o editar un alumno.

  constructor(
    private dialogRef: MatDialogRef<CreateAlumnComponent>,
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createAlumno = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(9)]],
      fechaNacimiento: ['', this.fechaValida],
      dni: ['', Validators.minLength(8)],
      email: ['', Validators.email],
      direccion: [''],
      telefono: [''],
      categoria: ['', Validators.required],
      mesAbonado: [''],
      seguroAltaBaja: [''],
      montoInsc: [''],
      fechaMontoInsc: [''],
      mesMarzo: [''],
      mesAbril: [''],
      mesMayo: [''],
      mesJunio: [''],
      mesJulio: [''],
      mesAgosto: [''],
      mesSeptiembre: [''],
      mesOctubre: [''],
      mesNoviembre: [''],
      mesDiciembre: [''],
      tutoresResponsables: [''],
      observacionesAlumno: [''],
      permisoImagen: [''],
      seRetiraSolo: [''],
    });

    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  get nombreNoValido() {
    return (
      this.createAlumno.get('nombre')?.invalid &&
      this.createAlumno.get('nombre')?.touched
    );
  }

  get dniNoValido() {
    return (
      this.createAlumno.get('dni')?.invalid &&
      this.createAlumno.get('dni')?.touched
    );
  }

  get emailNoValido() {
    return (
      this.createAlumno.get('email')?.invalid &&
      this.createAlumno.get('email')?.touched
    );
  }

  get fechaNoValido() {
    return (
      this.createAlumno.get('fechaNacimiento')?.invalid &&
      this.createAlumno.get('fechaNacimiento')?.touched
    );
  }

  fechaValida(control: FormControl) {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const minDate = new Date(1900, 0, 1); // 1 de enero de 1900

    // Verificar si la fecha de nacimiento es mayor que hoy o menor que 1900
    if (fecha > hoy || fecha < minDate) {
      return { fechaInvalida: true };
    }

    return null;
  }

  //Valida el formulario y llama a agregar o editar alumno según sea necesario.
  agregarEditarAlumno() {
    this.submitted = true;

    if (this.createAlumno.invalid) {
      return;
    }

    if (this.data) {
      this.editarAlumno(this.data.id);
    } else {
      this.agregarAlumno();
    }
  }

  //Métodos para comunicarse con el servicio alumnoService para agregar o actualizar datos en la base de datos.
  agregarAlumno() {
    const fechaActual = new Date();
    const alumno: any = {
      nombre: this.createAlumno.value.nombre,
      fechaNacimiento: this.createAlumno.value.fechaNacimiento,
      dni: this.createAlumno.value.dni,
      email: this.createAlumno.value.email,
      direccion: this.createAlumno.value.direccion,
      telefono: this.createAlumno.value.telefono,
      categoria: this.createAlumno.value.categoria,
      mesAbonado: this.createAlumno.value.mesAbonado,
      seguroAltaBaja: this.createAlumno.value.seguroAltaBaja,
      montoInsc: this.createAlumno.value.montoInsc,
      fechaMontoInsc: this.createAlumno.value.fechaMontoInsc || fechaActual,
      mesMarzo: this.createAlumno.value.mesMarzo,
      mesAbril: this.createAlumno.value.mesAbril,
      mesMayo: this.createAlumno.value.mesMayo,
      mesJunio: this.createAlumno.value.mesJunio,
      mesJulio: this.createAlumno.value.mesJulio,
      mesAgosto: this.createAlumno.value.mesAgosto,
      mesSeptiembre: this.createAlumno.value.mesSeptiembre,
      mesOctubre: this.createAlumno.value.mesOctubre,
      mesNoviembre: this.createAlumno.value.mesNoviembre,
      mesDiciembre: this.createAlumno.value.mesDiciembre,
      tutoresResponsables: this.createAlumno.value.tutoresResponsables,
      observacionesAlumno: this.createAlumno.value.observacionesAlumno,
      permisoImagen: this.createAlumno.value.permisoImagen,
      seRetiraSolo: this.createAlumno.value.seRetiraSolo,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    const nombreAlumno = this.createAlumno.value.nombre.toUpperCase();
    const mensaje = `Se ha creado: ${nombreAlumno}.`;
    this.alumnoService
      .agregarAlumno(alumno)
      .then(() => {
        this.toastr.success(mensaje, 'Alumno/a Registrado', {
          positionClass: 'toast-bottom-right',
        });
        this.loading = false;
        // this.dialogRef.close();
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
    this.dialogRef.close();
  }

  editarAlumno(id: string) {
    const fechaActual = new Date();
    const alumno: any = {
      nombre: this.createAlumno.value.nombre,
      fechaNacimiento: this.createAlumno.value.fechaNacimiento,
      dni: this.createAlumno.value.dni,
      email: this.createAlumno.value.email,
      direccion: this.createAlumno.value.direccion,
      telefono: this.createAlumno.value.telefono,
      categoria: this.createAlumno.value.categoria,
      mesAbonado: this.createAlumno.value.mesAbonado,
      seguroAltaBaja: this.createAlumno.value.seguroAltaBaja,
      montoInsc: this.createAlumno.value.montoInsc,
      fechaMontoInsc: this.createAlumno.value.fechaMontoInsc || fechaActual,
      mesMarzo: this.createAlumno.value.mesMarzo,
      mesAbril: this.createAlumno.value.mesAbril,
      mesMayo: this.createAlumno.value.mesMayo,
      mesJunio: this.createAlumno.value.mesJunio,
      mesJulio: this.createAlumno.value.mesJulio,
      mesAgosto: this.createAlumno.value.mesAgosto,
      mesSeptiembre: this.createAlumno.value.mesSeptiembre,
      mesOctubre: this.createAlumno.value.mesOctubre,
      mesNoviembre: this.createAlumno.value.mesNoviembre,
      mesDiciembre: this.createAlumno.value.mesDiciembre,
      tutoresResponsables: this.createAlumno.value.tutoresResponsables,
      observacionesAlumno: this.createAlumno.value.observacionesAlumno,
      permisoImagen: this.createAlumno.value.permisoImagen,
      seRetiraSolo: this.createAlumno.value.seRetiraSolo,
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    const nombreAlumno = this.createAlumno.value.nombre.toUpperCase();
    const mensaje = `Se ha modificado: ${nombreAlumno}.`;
    this.alumnoService
      .actualizarAlumno(id, alumno)
      .then(() => {
        this.loading = false;
        this.toastr.info(mensaje, 'Registro Modificado', {
          positionClass: 'toast-bottom-right',
        });
        //  this.dialogRef.close();
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
    this.dialogRef.close();
  }

  esEditar() {
    if (this.data) {
      this.createAlumno.setValue({
        nombre: this.data.nombre,
        fechaNacimiento: this.data.fechaNacimiento,
        dni: this.data.dni,
        email: this.data.email,
        direccion: this.data.direccion,
        telefono: this.data.telefono,
        categoria: this.data.categoria,
        mesAbonado: this.data.mesAbonado,
        seguroAltaBaja: this.data.seguroAltaBaja,
        montoInsc: this.data.montoInsc,
        fechaMontoInsc: this.data.fechaMontoInsc,
        mesMarzo: this.data.mesMarzo,
        mesAbril: this.data.mesAbril,
        mesMayo: this.data.mesMayo,
        mesJunio: this.data.mesJunio,
        mesJulio: this.data.mesJulio,
        mesAgosto: this.data.mesAgosto,
        mesSeptiembre: this.data.mesSeptiembre,
        mesOctubre: this.data.mesOctubre,
        mesNoviembre: this.data.mesNoviembre,
        mesDiciembre: this.data.mesDiciembre,
        tutoresResponsables: this.data.tutoresResponsables,
        observacionesAlumno: this.data.observacionesAlumno,
        permisoImagen: this.data.permisoImagen,
        seRetiraSolo: this.data.seRetiraSolo,
      });
      this.titulo = 'Editar Alumno/a';
    }
  }

  //Evita que el formulario se envíe accidentalmente al presionar Enter.
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.agregarEditarAlumno();
    }
  }
}
