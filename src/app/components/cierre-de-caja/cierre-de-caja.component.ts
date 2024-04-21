import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';

@Component({
  selector: 'app-cierre-de-caja',
  templateUrl: './cierre-de-caja.component.html',
  styleUrls: ['./cierre-de-caja.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CierreDeCajaComponent implements OnInit {
  alumnos: any[] = []; //Array para almacenar los datos de los alumnos.
  categorias = [
    'Mosquitos',
    'PMM',
    'PreMini',
    'Mini',
    'U13',
    'U15',
    'U17',
    'Primera',
  ]; //Array de categorías deportivas.

  // Arrays para almacenar los totales por categoría y los totales generales de los ingresos de los meses
  mesMarzo: { categoria: string; totalMP: number; totalE: number }[] = [];
  totalGeneralMarzo = 0;
  mesAbril: { categoria: string; totalMP: number; totalE: number }[] = [];
  totalGeneralAbril = 0;
  mesMayo: { categoria: string; totalMP: number; totalE: number }[] = [];
  totalGeneralMayo = 0;

  constructor(private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.getAlumnos();
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
      this.calcularTotales();
    });
  }

  // Método para calcular los ingresos totales por categoría y un total general de ingresos para un mes específico, basándose en un array de categorías y un mes específico (como parámetro mes).
  sumarIngresos(
    categorias: string[],
    mes: string
  ): {
    totalesPorCategoria: {
      categoria: string;
      totalMP: number;
      totalE: number;
    }[];
    totalGeneral: number;
  } {
    const resultados: { categoria: string; totalMP: number; totalE: number }[] =
      [];
    let totalGeneral = 0;

    for (const categoria of categorias) {
      let totalMP = 0;
      let totalE = 0;

      const alumnosCategoria = this.alumnos.filter(
        (alumno) => alumno.categoria === categoria
      );

      alumnosCategoria.forEach((alumno) => {
        const valor = alumno[mes];
        if (typeof valor === 'string') {
          // Asegurarse de que el valor contiene dígitos antes de intentar convertirlo
          const monto = parseFloat(valor.replace(/[^\d.-]/g, ''));
          if (!isNaN(monto)) {
            // Verificar que el monto es un número válido
            if (valor.includes('MP')) {
              totalMP += monto;
            } else if (valor.includes('E')) {
              totalE += monto;
            }
            // Suma el monto al total general sin importar si es MP o E
            totalGeneral += monto;
          }
        }
      });

      resultados.push({ categoria, totalMP, totalE });
    }

    // Devuelve tanto los totales por categoría como el total general combinado de MP y E
    return {
      totalesPorCategoria: resultados,
      totalGeneral: totalGeneral,
    };
  }
  //Calcula y almacena los totales por categoría y los totales generales de los meses especificados
  calcularTotales(): void {
    const resultadoMarzo = this.sumarIngresos(this.categorias, 'mesMarzo');
    this.mesMarzo = resultadoMarzo.totalesPorCategoria;
    this.totalGeneralMarzo = resultadoMarzo.totalGeneral; // Almacena el total general

    const resultadoAbril = this.sumarIngresos(this.categorias, 'mesAbril');
    this.mesAbril = resultadoAbril.totalesPorCategoria;
    this.totalGeneralAbril = resultadoAbril.totalGeneral;

    const resultadoMayo = this.sumarIngresos(this.categorias, 'mesMayo');
    this.mesMayo = resultadoMayo.totalesPorCategoria;
    this.totalGeneralMayo = resultadoMayo.totalGeneral;
  }
}
