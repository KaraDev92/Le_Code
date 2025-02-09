import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginM } from '../interfaces/loginM';
import { Observable, tap } from 'rxjs';
import { ROOT_URL } from '../../../app.config';


type AuthResponse = {
  accessToken: string;
}

const TOKEN_KEY = 'angular-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly rootUrl = inject(ROOT_URL);
  token = signal('');

  constructor() { 
     this.token.set(localStorage.getItem(TOKEN_KEY) ?? '')
  };

  sendLogin(loginM: LoginM): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.rootUrl + '/login', loginM).pipe(
      tap((response) => {
          const token = response.accessToken;
          this.token.set(token);
          localStorage.setItem(TOKEN_KEY, token);
          console.log('token reçu : ', this.token());
      })
    );
  };

  isAuthenticated(): boolean {
    return !!this.token();    //rappel : !! convertie this.token en booléen et () pour lire la valeur
  };

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set('');
    console.log('token de logout()', !!this.token());
  }
}
