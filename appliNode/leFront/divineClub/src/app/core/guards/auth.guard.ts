import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  //Si pas authentifié, va sur page login
  if (!authService.isAuthenticated()) {
      router.navigateByUrl('/login');  
      return false
  }
  return true
}