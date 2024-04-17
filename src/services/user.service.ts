import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private baseUrl = 'https://picahuesos-backend-picahuesos.onrender.com';
  private baseUrl = 'https://jotavx-picahuesos-backend.onrender.com';

  constructor(private auth: Auth, private http: HttpClient) {}

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  enviarCorreo(params: any): Observable<any> {
    const url = `${this.baseUrl}/envio`;
    return this.http.post(url, params);
  }
}
