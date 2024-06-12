import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnoService } from 'src/services/alumno.service';
import { CategoriaTotal } from 'src/app/models/categoria-total.model';
import { DatosMensuales } from 'src/app/models/datos-mensuales.model';

@Component({
  selector: 'app-cierre-de-caja',
  templateUrl: './cierre-de-caja.component.html',
  styleUrls: ['./cierre-de-caja.component.css'],
})
export class CierreDeCajaComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'categoria',
    'totalMP',
    'totalE',
    'totalSinEspecificar',
  ];

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

  datosMensuales: DatosMensuales = {};

  totalInscripcion: number = 0;

  datosInscripcionesMensuales: { [key: string]: number } = {};

  constructor(private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.getAlumnos();
  }

  getAlumnos() {
    this._alumnoService.getAlumnos().subscribe((data) => {
      this.alumnos = data.map((element: any) => ({
        id: element.payload.doc.id,
        ...element.payload.doc.data(),
      }));
      this.calcularTotales(this.meses.map((m) => m.clave));
      this.calcularInscripcionesPorMes();
    });
  }

  calcularTotales(meses: string[]): void {
    meses.forEach((mes) => {
      this.datosMensuales[mes] = this.sumarIngresos(this.categorias, mes);
    });
  }

  parseAmount(value: string): number {
    const formatUsesCommas = value.includes(',');
    const formatUsesPoints = value.includes('.');

    let normalizedValue = value;

    if (formatUsesCommas && formatUsesPoints) {
      normalizedValue = value.replace(/,/g, '');
    } else if (formatUsesCommas) {
      normalizedValue = value.replace(/,/g, '.');
    } else {
      normalizedValue = value.replace(/\./g, '');
    }

    return parseFloat(normalizedValue);
  }

  sumarIngresos(
    categorias: string[],
    mes: string
  ): {
    categorias: CategoriaTotal[];
    totalGeneral: number;
  } {
    let totalGeneral = 0;
    const totalesPorCategoria = categorias.map((categoria) => {
      const { totalMP, totalE, totalSinEspecificar } = this.alumnos
        .filter((alumno) => alumno.categoria === categoria)
        .reduce(
          (acc, alumno) => {
            const valor = alumno[mes];
            if (typeof valor === 'string') {
              const monto = this.parseAmount(valor.replace(/[^\d.-]/g, ''));
              if (!isNaN(monto)) {
                const valorMinusculas = valor.toLowerCase();
                if (valorMinusculas.includes('mp')) {
                  acc.totalMP += monto;
                } else if (valorMinusculas.includes('e')) {
                  acc.totalE += monto;
                } else {
                  acc.totalSinEspecificar += monto;
                }
                totalGeneral += monto;
              }
            }
            return acc;
          },
          { totalMP: 0, totalE: 0, totalSinEspecificar: 0 }
        );
      return { categoria, totalMP, totalE, totalSinEspecificar };
    });

    return { categorias: totalesPorCategoria, totalGeneral };
  }

  parseCurrency(value: string): number {
    if (!value) return 0;
    // Elimina todos los caracteres no numéricos excepto el punto decimal
    const numberValue = this.parseAmount(value.replace(/[^\d.-]/g, ''));
    return isNaN(numberValue) ? 0 : numberValue;
  }

  calcularInscripcionesPorMes() {
    this.datosInscripcionesMensuales = {};

    this.alumnos.forEach((alumno) => {
      const montoInsc = this.parseCurrency(alumno.montoInsc);
      if (alumno.fechaMontoInsc) {
        let fecha;
        if (alumno.fechaMontoInsc.seconds) {
          fecha = new Date(alumno.fechaMontoInsc.seconds * 1000); // Si es timestamp
        } else {
          fecha = new Date(alumno.fechaMontoInsc); // Si es ISO
        }

        const mes = fecha.getMonth() + 1;
        const claveMes = `mes${mes}`;

        if (!this.datosInscripcionesMensuales[claveMes]) {
          this.datosInscripcionesMensuales[claveMes] = 0;
        }
        this.datosInscripcionesMensuales[claveMes] += montoInsc;
      }
    });
  }
}
