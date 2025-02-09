import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-in.component.html',
  styleUrl: './navbar-in.component.scss'
})
export class NavbarInComponent {
  private authService = inject (AuthService);
  logOut() {
    this.authService.logout();
  }

}
