//import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {

//   return true;
// };


export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
      router.navigateByUrl('/login');
      return false
  }
  return true
}