import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

  // NUEVO  ///////////////////////////////////  ///////////////////////////////////  /////////////////////////////////// NUEVO //

  moverAlumnoABajas(id: string): Promise<void> {
    return this.firestore
      .collection('alumnos')
      .doc(id)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        // Asegúrate de que el documento existe y tiene datos antes de proceder
        if (docSnapshot?.exists) {
          const data = docSnapshot.data();
          if (data) {
            // Asegúrate de que hay datos para copiar
            return this.firestore
              .collection('bajas')
              .doc(id)
              .set(data)
              .then(() => {
                return this.eliminarAlumno(id); // Elimina el documento de la colección original
              });
          }
        }
        throw new Error('Documento no encontrado o sin datos');
      })
      .catch((error) => {
        console.error('Error al mover el alumno:', error);
        throw error; // Propaga el error para manejo adicional si es necesario
      });
  }

  devolverAlumnos(id: string): Promise<void> {
    return this.firestore
      .collection('bajas')
      .doc(id)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        if (docSnapshot?.exists) {
          const data = docSnapshot.data();
          if (data) {
            return this.firestore
              .collection('alumnos')
              .doc(id)
              .set(data)
              .then(() => {
                return this.firestore.collection('bajas').doc(id).delete();
              });
          }
        }
        throw new Error('Documento no encontrado');
      })
      .catch((error) => {
        console.error('Error al devolver el alumno:', error);
        throw error; // Propagar el error para manejo adicional si es necesario
      });
  }

  getBajasAlumnos(): Observable<any> {
    return this.firestore
      .collection('bajas', (ref) => ref.orderBy('mesAbonado', 'asc'))
      .snapshotChanges();
  }

  // NUEVO  ///////////////////////////////////  ///////////////////////////////////  /////////////////////////////////// NUEVO //
}
