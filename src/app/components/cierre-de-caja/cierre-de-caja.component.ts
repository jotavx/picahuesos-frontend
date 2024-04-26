import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnoService } from 'src/services/alumno.service';

@Component({
  selector: 'app-cierre-de-caja',
  templateUrl: './cierre-de-caja.component.html',
  styleUrls: ['./cierre-de-caja.component.css'],
})
export class CierreDeCajaComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['categoria', 'totalMP', 'totalE'];
  alumnos: any[] = [];
  categorias = [
    'Mosquitos',
    'PMM',
    'PreMini',
    'Mini',
    'U13',
    'U15',
    'U17',
    'Primera',
  ];
  meses = [
    { clave: 'mesMarzo', nombre: 'Marzo', num: 3 },
    { clave: 'mesAbril', nombre: 'Abril', num: 4 },
    { clave: 'mesMayo', nombre: 'Mayo', num: 5 },
    { clave: 'mesJunio', nombre: 'Junio', num: 6 },
    { clave: 'mesJulio', nombre: 'Julio', num: 7 },
    { clave: 'mesAgosto', nombre: 'Agosto', num: 8 },
    { clave: 'mesSeptiembre', nombre: 'Septiembre', num: 9 },
    { clave: 'mesOctubre', nombre: 'Octubre', num: 10 },
    { clave: 'mesNoviembre', nombre: 'Noviembre', num: 11 },
    { clave: 'mesDiciembre', nombre: 'Diciembre', num: 12 },
  ];
  datosMensuales: {
    [key: string]: {
      categorias: { categoria: string; totalMP: number; totalE: number }[];
      totalGeneral: number;
    };
  } = {};

  constructor(private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.getAlumnos();
    console.log(this.datosInscripcionesMensuales);
  }

  getAlumnos() {
    this._alumnoService.getAlumnos().subscribe((data) => {
      this.alumnos = [];
      data.forEach((element: any) => {
        this.alumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.calcularTotales(this.meses.map((m) => m.clave));
      this.calcularInscripcionesPorMes();
    });
  }

  calcularTotales(meses: string[]): void {
    meses.forEach((mes) => {
      this.datosMensuales[mes] = this.sumarIngresos(this.categorias, mes);
    });
  }

  sumarIngresos(
    categorias: string[],
    mes: string
  ): {
    categorias: { categoria: string; totalMP: number; totalE: number }[];
    totalGeneral: number;
  } {
    let totalGeneral = 0;
    const totalesPorCategoria = categorias.map((categoria) => {
      let totalMP = 0;
      let totalE = 0;

      this.alumnos
        .filter((alumno) => alumno.categoria === categoria)
        .forEach((alumno) => {
          const valor = alumno[mes];
          if (typeof valor === 'string') {
            const monto = parseFloat(valor.replace(/[^\d.-]/g, ''));
            if (!isNaN(monto)) {
              if (valor.includes('MP')) totalMP += monto;
              if (valor.includes('E')) totalE += monto;
              totalGeneral += monto;
            }
          }
        });
      return { categoria, totalMP, totalE };
    });

    return { categorias: totalesPorCategoria, totalGeneral };
  }

  totalInscripcion: number = 0;
  datosInscripcionesMensuales: { [key: string]: number } = {};

  parseCurrency(value: string): number {
    if (!value) return 0;
    // Elimina todos los caracteres no numéricos excepto el punto decimal
    const numberValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    return isNaN(numberValue) ? 0 : numberValue;
  }

  calcularInscripcionesPorMes() {
    this.datosInscripcionesMensuales = {}; // Reiniciar los datos

    this.alumnos.forEach((alumno) => {
      const montoInsc = this.parseCurrency(alumno.montoInsc);
      if (alumno.fechaMontoInsc) {
        const fecha = new Date(alumno.fechaMontoInsc.seconds * 1000);
        const mes = fecha.getMonth() + 1; // Obtiene el mes (1-12)
        const claveMes = `mes${mes}`; // mes1, mes2, etc.

        if (!this.datosInscripcionesMensuales[claveMes]) {
          this.datosInscripcionesMensuales[claveMes] = 0;
        }
        this.datosInscripcionesMensuales[claveMes] += montoInsc;
      }
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { AlumnoService } from 'src/services/alumno.service';

// @Component({
//   selector: 'app-cierre-de-caja',
//   templateUrl: './cierre-de-caja.component.html',
//   styleUrls: ['./cierre-de-caja.component.css'],
// })
// export class CierreDeCajaComponent implements OnInit {
//   dataSource = new MatTableDataSource<any>();
//   displayedColumns: string[] = ['categoria', 'totalMP', 'totalE'];
//   alumnos: any[] = [];
//   categorias = [
//     'Mosquitos',
//     'PMM',
//     'PreMini',
//     'Mini',
//     'U13',
//     'U15',
//     'U17',
//     'Primera',
//   ];
//   meses = [
//     { clave: 'mesMarzo', nombre: 'Marzo' },
//     { clave: 'mesAbril', nombre: 'Abril' },
//     { clave: 'mesMayo', nombre: 'Mayo' },
//     { clave: 'mesJunio', nombre: 'Junio' },
//     { clave: 'mesJulio', nombre: 'Julio' },
//     { clave: 'mesAgosto', nombre: 'Agosto' },
//     { clave: 'mesSeptiembre', nombre: 'Septiembre' },
//     { clave: 'mesOctubre', nombre: 'Octubre' },
//     { clave: 'mesNoviembre', nombre: 'Noviembre' },
//     { clave: 'mesDiciembre', nombre: 'Diciembre' },
//   ];
//   datosMensuales: {
//     [key: string]: {
//       categorias: { categoria: string; totalMP: number; totalE: number }[];
//       totalGeneral: number;
//     };
//   } = {};

//   constructor(private _alumnoService: AlumnoService) {}

//   ngOnInit(): void {
//     this.getAlumnos();
//   }

//   getAlumnos() {
//     this._alumnoService.getAlumnos().subscribe((data) => {
//       this.alumnos = data.map((element: any) => ({
//         id: element.payload.doc.id,
//         ...element.payload.doc.data(),
//       }));
//       this.calcularTotales(this.meses.map((m) => m.clave));
//     });
//   }

//   calcularTotales(meses: string[]): void {
//     meses.forEach((mes) => {
//       this.datosMensuales[mes] = this.sumarIngresos(this.categorias, mes);
//     });
//   }

//   sumarIngresos(
//     categorias: string[],
//     mes: string
//   ): {
//     categorias: { categoria: string; totalMP: number; totalE: number }[];
//     totalGeneral: number;
//   } {
//     let totalGeneral = 0;
//     const totalesPorCategoria = categorias.map((categoria) => {
//       let totalMP = 0;
//       let totalE = 0;

//       this.alumnos
//         .filter((alumno) => alumno.categoria === categoria)
//         .forEach((alumno) => {
//           const valor = alumno[mes];
//           if (typeof valor === 'string') {
//             const monto = parseFloat(valor.replace(/[^\d.-]/g, ''));
//             if (!isNaN(monto)) {
//               if (valor.includes('MP')) totalMP += monto;
//               if (valor.includes('E')) totalE += monto;
//               totalGeneral += monto;
//             }
//           }
//         });
//       return { categoria, totalMP, totalE };
//     });

//     return { categorias: totalesPorCategoria, totalGeneral };
//   }
// }
