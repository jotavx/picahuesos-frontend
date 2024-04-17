import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  constructor(private firestore: AngularFirestore) {}

  getData(): Observable<any> {
    return this.firestore
      .collection('recordatorios', (ref) => ref.orderBy('reminderDate', 'asc'))
      .snapshotChanges();
  }

  buildContent(content: any): Promise<any> {
    return this.firestore.collection('recordatorios').add(content);
  }

  editContent(id: string, data: any): Promise<any> {
    return this.firestore.collection('recordatorios').doc(id).update(data);
  }

  deleteContent(id: string): Promise<any> {
    return this.firestore.collection('recordatorios').doc(id).delete();
  }

  getId(id: string): Observable<any> {
    return this.firestore.collection('recordatorios').doc(id).snapshotChanges();
  }
}
