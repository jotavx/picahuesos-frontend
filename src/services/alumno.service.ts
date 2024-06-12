import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(private firestore: AngularFirestore) {}

  agregarAlumno(alumno: any): Promise<any> {
    return this.firestore.collection('alumnos').add(alumno);
  }

  getAlumnos(): Observable<any> {
    return this.firestore
      .collection('alumnos', (ref) => ref.orderBy('mesAbonado', 'asc'))
      .snapshotChanges();
  }

  eliminarAlumno(id: string): Promise<any> {
    return this.firestore.collection('alumnos').doc(id).delete();
  }

  getAlumno(id: string): Observable<any> {
    return this.firestore.collection('alumnos').doc(id).snapshotChanges();
  }

  actualizarAlumno(id: string, data: any): Promise<any> {
    return this.firestore.collection('alumnos').doc(id).update(data);
  }

  getAlumnosPorCategoria(categoria: string): Observable<any> {
    if (categoria === 'Todos') {
      return this.getAlumnos();
    } else {
      return this.firestore
        .collection('alumnos', (ref) =>
          ref.where('categoria', '==', categoria).orderBy('mesAbonado', 'asc')
        )
        .snapshotChanges();
    }
  }

  actualizarMontoMes(id: string, mes: string, monto: number): Promise<any> {
    const updateData: any = {};
    updateData[`mes${mes}`] = monto;
    return this.firestore.collection('alumnos').doc(id).update(updateData);
  }

  actualizarMontoInscripcion(id: string, monto: number): Promise<any> {
    return this.firestore
      .collection('alumnos')
      .doc(id)
      .update({ montoInsc: monto });
  }

  async moverAlumnoABajas(id: string): Promise<void> {
    try {
      const alumnosCollection = this.firestore.collection('alumnos');
      const bajasCollection = this.firestore.collection('bajas');

      const docSnapshot$ = alumnosCollection.doc(id).get();

      const docSnapshot = await firstValueFrom(docSnapshot$);

      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data) {
          await bajasCollection.doc(id).set(data);
          await this.eliminarAlumno(id);
          return;
        }
      }

      throw new Error('Documento no encontrado o sin datos');
    } catch (error) {
      console.error('Error al mover el alumno:', error);
      throw error;
    }
  }

  async devolverAlumnos(id: string): Promise<void> {
    try {
      const bajasCollection = this.firestore.collection('bajas');
      const alumnosCollection = this.firestore.collection('alumnos');

      const docSnapshot$ = bajasCollection.doc(id).get();

      const docSnapshot = await firstValueFrom(docSnapshot$);

      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data) {
          await alumnosCollection.doc(id).set(data);
          await bajasCollection.doc(id).delete();
          return;
        }
      }

      throw new Error('Documento no encontrado');
    } catch (error) {
      console.error('Error al devolver el alumno:', error);
      throw error;
    }
  }

  getBajasAlumnos(): Observable<any> {
    return this.firestore
      .collection('bajas', (ref) => ref.orderBy('mesAbonado', 'asc'))
      .snapshotChanges();
  }

  actualizarComprobanteEnviado(
    id: string,
    tipo: string,
    enviado: boolean
  ): Promise<void> {
    return this.firestore
      .collection('alumnos')
      .doc(id)
      .update({
        [`comprobantesEnviados.${tipo}`]: enviado,
      });
  }
}
