import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-in.component.html',
  styleUrl: './navbar-in.component.scss'
})
export class NavbarInComponent {
  private authService = inject (AuthService);
  router = inject(Router);

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
