import { Component, ViewEncapsulation } from '@angular/core';
import { NavbarOutComponent } from './app/features/navbar/navbar-out/navbar-out.component';
import { HomeComponent } from './app/pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarOutComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  template: '<app-navbar-out /> <app-home />'
})
export class AppComponent {
  title = 'Divine Club';
}
