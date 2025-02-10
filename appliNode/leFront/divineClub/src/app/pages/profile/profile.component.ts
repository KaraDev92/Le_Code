import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { ErrorMessageComponent } from "../../features/error-message/error-message.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private dataXchange = inject(DataXchangeService);
  private subscription!: Subscription;
  //variable memberSi est un signal
  memberSi = this.dataXchange.member;
  errorMessage: string = '';

  ngOnInit(): void {
    this.subscription = this.dataXchange.getMember().subscribe();
    console.log('data de memberSi : ', this.memberSi());
   //this.errorMessage = "Problème !";
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
