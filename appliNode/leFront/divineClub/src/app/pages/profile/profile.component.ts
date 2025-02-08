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
  

  ngOnInit(): void {
   this.subscription = this.dataXchange.getMember().subscribe();
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
