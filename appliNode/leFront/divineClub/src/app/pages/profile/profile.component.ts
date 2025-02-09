import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { ErrorMessageComponent } from "../../features/error-message/error-message.component";
import { Member } from '../../core/interfaces/member';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private dataXchange = inject(DataXchangeService);
  private subscription!: Subscription;
  member = this.dataXchange.member();
  errorMessage: string = '';

  ngOnInit(): void {
    this.subscription = this.dataXchange.getMember().subscribe();
    console.log('data de member : ', this.member);
   //this.errorMessage = "Problème !";
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
