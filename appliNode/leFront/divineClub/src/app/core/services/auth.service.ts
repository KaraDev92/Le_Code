import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginM } from '../interfaces/loginM';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ROOT_URL } from '../../../app.config';


type AuthResponse = {
  token: string;
}

//pour l'option remember me
//const TOKEN_KEY = 'angular-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly rootUrl = inject(ROOT_URL);
  token = signal('');

  //pour l'option remember me
  // constructor() { 
  //   this.token.set(localStorage.getItem(TOKEN_KEY) ?? '')
  // }

  sendLogin(loginM: LoginM): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.rootUrl + '/login', loginM).pipe(
      tap((response) => {
          const token = response.token;
          this.token.set(token);
          // ou plutôt dans login.component car sinon doit récupérer le pseudo qui est dans loginM
          //const router = inject(Router);
          //router.navigateByUrl('/profile', pseudo); // ou plutôt dans login.component ?
          

          //pour l'option remember me
          // if (remember) {
          //     localStorage.setItem(TOKEN_KEY, token);
          // }
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // logout() {
  //   this.isAuthenticated = false;
  // }




}
