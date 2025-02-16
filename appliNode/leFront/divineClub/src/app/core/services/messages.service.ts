import { Injectable, inject, signal } from '@angular/core';
import { Message } from '../interfaces/message';
import { Observable, tap, catchError } from 'rxjs';
import { ROOT_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ListMessages } from '../interfaces/listMessages';

@Injectable({
  providedIn: 'root'
})

export class MessagesService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly rootURL = inject(ROOT_URL);

  messagesList = signal<ListMessages> ({
    pseudo: '',
    amis: [],
    messages: []
  });

  //récupérer messages et liste d'amis du membre
  getMessagesFriends(): Observable<ListMessages> {
    return this.http.get<ListMessages>(this.rootURL + '/messagearea').pipe(
      tap((listM) => {
        this.messagesList.set(listM);
      }),
      catchError (error => {
        console.log('Erreur de récup du profil : ', error);
        throw new Error(error);
      })
    )  
  };

  //envoyer un message à un ami
  sendMessage(message: Message): Observable<Message> {
    return this.http.put<Message>(this.rootURL + '/sendmessage', message).pipe(
      catchError (error => {
        console.log('Erreur d\'envoi de message : ', error);
        throw new Error(error);
      })
    )
  };

  //marquer un message comme lu
  markRead(message: Message): Observable<Message> {
    this.messagesList.update((messagesList) => {
      messagesList.messages = messagesList.messages.filter((mess) => mess.date !== message.date);
      return messagesList;
    });
    return this.http.put<Message>(this.rootURL + '/markread', message).pipe(
      catchError (error => {
        console.log('Erreur de marquage du message comme lu : ', error);
        throw new Error(error);
      })
    )
  }
  
  constructor() { }
}
