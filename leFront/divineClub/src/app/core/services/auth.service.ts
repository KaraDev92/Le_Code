import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginM } from '../interfaces/loginM';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from '../../../app.config';


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
  private readonly apiUrl = inject(API_URL);
  token = signal('');

  //pour l'option remember me
  // constructor() { 
  //   this.token.set(localStorage.getItem(TOKEN_KEY) ?? '')
  // }

  sendlogin(loginM: LoginM): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', loginM).pipe(
      tap((response) => {
          const token = response.token;
          this.token.set(token);
          // doit récupérer le pseudo ???!!!!
          //const router = inject(Router);
          //router.navigateByUrl('/profile', pseudo);
          

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
