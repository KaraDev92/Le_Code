import { Component } from '@angular/core';
import { NavbarOutComponent } from './app/features/navbar/navbar-out/navbar-out.component';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarOutComponent, RouterOutlet, RouterLink], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Divine Club';
}
