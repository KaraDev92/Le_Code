import { Component, inject, OnInit } from '@angular/core';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { Friend } from '../../core/interfaces/friend';
import { ErrorMessageComponent } from '../../features/error-message/error-message.component';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MessagesService } from '../../core/services/messages.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-friend-page',
  standalone: true,
  imports: [ErrorMessageComponent, FormsModule, DatePipe, RouterLink],
  templateUrl: './friend-page.component.html',
  styleUrl: './friend-page.component.scss'
})
export class FriendPageComponent {
  private dataXchange = inject(DataXchangeService);
  private router = inject(Router);
  private subscription!: Subscription;
  private messagesService = inject(MessagesService);

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
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 418") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  };

  //demande d'ami
  askForFriend(amiDemande: string) {
    console.log('ami demandé depuis page friend : ', amiDemande);
    this.messagesService.askForFriend(amiDemande).subscribe({
      next:() => {
        this.errorMessage = "Nous avons envoyé votre requête d'amitié à " + amiDemande + ".";
      },
      error: (err) => {
      const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    })
  };

}
