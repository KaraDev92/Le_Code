import { Component, inject, OnInit } from '@angular/core';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { Friend } from '../../core/interfaces/friend';
import { ErrorMessageComponent } from '../../features/error-message/error-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-page',
  standalone: true,
  imports: [ErrorMessageComponent, FormsModule, DatePipe],
  templateUrl: './friend-page.component.html',
  styleUrl: './friend-page.component.scss'
})
export class FriendPageComponent {
  private dataXchange = inject(DataXchangeService);
  private router = inject(Router);
  private subscription!: Subscription;

  friendSi = this.dataXchange.friend;
  memberSi = this.dataXchange.member;
  errorMessage: string = '';

  goToFriendPage(ami: string) {
    if (ami === this.memberSi().pseudo) {
      this.router.navigateByUrl('/profile');
      return;
    }
    const amiRecherche = {pseudo: ami};
    this.subscription = this.dataXchange.searchFriend(amiRecherche).subscribe({
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 500") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 404") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  };

}
