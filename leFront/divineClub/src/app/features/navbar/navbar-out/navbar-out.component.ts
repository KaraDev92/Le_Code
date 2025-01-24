import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-out',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-out.component.html',
  styleUrl: './navbar-out.component.scss'
})
export class NavbarOutComponent { //utiliser ngModel pour du bi-directionnel p.30
  searchInput = '';
  search() {
    console.log(this.searchInput);
  }
}
