import { Component, inject, OnInit } from '@angular/core';
import { NavbarOutComponent } from './app/features/navbar/navbar-out/navbar-out.component';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NavbarInComponent } from './app/features/navbar/navbar-in/navbar-in.component';
import { AuthService } from './app/core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarOutComponent, RouterOutlet, RouterLink, NavbarInComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  connected = this.authService.isAuthenticated();
  title = 'Divine Club';

  ngOnInit(): void {
    this.authService.isAuthenticated();
    console.log('result de isAuthenticated : ', this.connected);
  }
}
