import { Component, inject, OnInit } from '@angular/core';
import { Message } from '../../../core/interfaces/message';
import { ListMessages } from '../../../core/interfaces/listMessages';
import { MessagesService } from '../../../core/services/messages.service';
import { DataXchangeService } from '../../../core/services/data-xchange.service';
import { ErrorMessageComponent } from '../../../features/error-message/error-message.component';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ErrorMessageComponent, DatePipe, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  private messagesService = inject(MessagesService);
  private dataXchange = inject(DataXchangeService);
  private subscription!: Subscription;

  memberSi = this.dataXchange.member;
  messageListSi = this.messagesService.messagesList;

  errorMessage: string = '';
  afficheCreerMessage = false;
  afficheMessage = false;

  marquerLu(message: Message) {
    if(!message.lu) {
      console.log('le message à cocher lu : ', message);
      console.log('messageListSi : ', this.messageListSi());
         // updater le signal
         // this.messageListSi().messages.date.update()
      this.messagesService.markRead(message);

        //updater le compteur de messages non lus
    }
  }

  afficher(fenetre: string):void {
    if (fenetre === 'pourEcrire') {
      this.afficheCreerMessage = !this.afficheCreerMessage;
    }
    if (fenetre === 'pourLire') {
      this.afficheMessage = !this.afficheMessage;
    }
  }

  //envoyer un message
  sendMessage(form: NgForm) {
    const message: Message = {
      expediteur: this.memberSi().pseudo,
      destinataire: form.value.recipientInput,
      sujet: form.value.titreMessageInput,
      contenu: form.value.txtMessageInput,
      date: new Date(),
      lu: false
    }
    console.log('message à envoyer : ', message);

    this.messagesService.sendMessage(message).subscribe({
      next: () => {
        this.errorMessage = "Message envoyé";
      },
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 418") {
          this.errorMessage = "Ami non trouvé";
        }
        if (erreur === "Error: 201") {
          this.errorMessage = "Message envoyé";
        }
      }
    });
  }


  ngOnInit(): void {
    //récupère les message du membre
    this.subscription = this.messagesService.getMessagesFriends().subscribe({
      error: (err) => {  
        const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    });
    console.log('data de getMessagesFriends : ', this.memberSi());
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
