export interface Alumno {
  id: string;
  nombre: string;
  fechaNacimiento: Date;
  dni: string;
  email: string;
  direccion: string;
  telefono: string;
  categoria: string;
  mesAbonado: string;
  seguroAltaBaja: string;
  montoInsc: string;
  fechaMontoInsc: Date;
  mesMarzo: string;
  mesAbril: string;
  mesMayo: string;
  mesJunio: string;
  mesJulio: string;
  mesAgosto: string;
  mesSeptiembre: string;
  mesOctubre: string;
  mesNoviembre: string;
  mesDiciembre: string;
  tutoresResponsables: string;
  observacionesAlumno: string;
  permisoImagen: string;
  seRetiraSolo: string;

  comprobantesEnviados: {
    inscripcion: false;
    Marzo: false;
    Abril: false;
    Mayo: false;
    Junio: false;
    Julio: false;
    Agosto: false;
    Septiembre: false;
    Octubre: false;
    Noviembre: false;
    Diciembre: false;
    // otros meses...
  };
}
