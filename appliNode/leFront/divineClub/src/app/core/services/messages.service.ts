import { Injectable, inject } from '@angular/core';
import { Message } from '../interfaces/message';
import { Observable, tap, catchError } from 'rxjs';
import { ROOT_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly rootURL = inject(ROOT_URL);

  //envoyer un message à un ami
  sendMessage(expediteur: string, destinataire: string, sujet: string, contenu: string ): Observable<Message> {
    const message = {expediteur: expediteur, destinataire: destinataire, sujet: sujet, contenu: contenu};
    return this.http.put<Message>(this.rootURL + '/sendmessage', message).pipe(
      catchError (error => {
        console.log('Erreur d\'envoi de message : ', error);
        throw new Error(error);
      })
    )
  };
  
  constructor() { }
}
