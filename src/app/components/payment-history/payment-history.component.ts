import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { Alumno } from 'src/app/models/alumno.model';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css'],
})
export class PaymentHistoryComponent implements OnInit, AfterViewInit {
  fileName = 'HistorialPagos.xlsx';

  selectedCategory: string = 'Mosquitos';

  alumnos: Alumno[] = [];

  displayedColumns: string[] = [
    'nombreCompleto',
    'montoInsc',
    'mesMarzo',
    'mesAbril',
    'mesMayo',
    'mesJunio',
    'mesJulio',
    'mesAgosto',
    'mesSeptiembre',
    'mesOctubre',
    'mesNoviembre',
    'mesDiciembre',
  ];

  dataSource = new MatTableDataSource<Alumno>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.filtrarPorCategoria('Mosquitos');
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

  filtrarPorCategoria(categoria: string): void {
    this.selectedCategory = categoria;
    sessionStorage.setItem('selectedCategory', categoria);
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

  exportExcel() {
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  //NEW
  formatFecha(fecha: any): string {
    let date;
    if (typeof fecha === 'string') {
      date = new Date(fecha);
    } else if (fecha.seconds && fecha.nanoseconds) {
      date = new Date(fecha.seconds * 1000 + fecha.nanoseconds / 1000000);
    } else {
      return 'Invalid Date';
    }
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${month.toString().padStart(2, '0')}/${year}`;
  }
}
