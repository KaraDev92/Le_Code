import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private dataXchange = inject(DataXchangeService);
  private subscription!: Subscription;
  member = this.dataXchange.member;
  pseudo = ''; // insérer la valeur de pseudo qui doit être récupérer à la connexion

  ngOnInit(): void {
   this.subscription = this.dataXchange.getMember(pseudo).subscribe();
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
