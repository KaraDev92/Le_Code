import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private isAuthenticated = false;

  // login() {
  //   this.isAuthenticated = true;
  // }

  // logout() {
  //   this.isAuthenticated = false;
  // }

  isAuthenticated(): boolean {
    //return this.isAuthenticated;
    return true; //à modifier
  }


  constructor() { }
}
