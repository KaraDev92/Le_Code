import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
      router.navigateByUrl('/login'); //Si pas authentifié, va sur page login 
      return false
  }
  return true
}