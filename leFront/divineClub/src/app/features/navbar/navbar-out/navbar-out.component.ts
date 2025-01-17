import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar-out',
  standalone: true,
  imports: [],
  templateUrl: './navbar-out.component.html',
  styleUrl: './navbar-out.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NavbarOutComponent { //utiliser ngModel pour du bi-directionnel p.30
  searchInput = '';
  search() {
    console.log(this.searchInput);
  }
}
