import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environmentApi } from 'src/environments/environment-api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environmentApi.apiBaseUrl;

  constructor(
    private auth: Auth,
    private http: HttpClient,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  enviarCorreo(params: any): Observable<any> {
    const url = `${this.baseUrl}/envio`;
    return this.http.post(url, params);
  }

  getServidores(): Observable<any> {
    return this.firestore.collection('servidores').snapshotChanges();
  }
}
