import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Member } from '../interfaces/member';
import { NewMember } from '../interfaces/new-member';

@Injectable({
  providedIn: 'root'
})
export class DataXchangeService {
  private http = inject(HttpClient);
  members = signal<Member[]>([]);
  //member = signal<NewMember>('');  //initialiser la valeur du signal !!!!
  readonly rootURL = 'http://localhost:3000';

  //récupère tous les membres !!!
  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.rootURL + '/users').pipe(
      tap(members => this.members.set(members)),
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        throw error;
      })
    );
    
  }

  //récupère 1 membre
  getMember(pseudo: string): Observable<Member> {
    return this.http.get<Member>(`${this.rootURL + '/user'}/${pseudo}`);
  }  //récupérer erreur

  // POST - Créer un nouvel utilisateur
  createMember(member: NewMember): Observable<NewMember> {
    return this.http.post<Member>(this.rootURL + '/user', member);
  }  //récupérer erreur

  // PATCH - Mettre à jour partiellement un utilisateur
  patchMember(pseudo: string, changes: Partial<Member>): Observable<Member> {
    return this.http.patch<Member>(`${this.rootURL + '/user'}/${pseudo}`, changes);
  }  //récupérer erreur
  
  // DELETE - Supprimer un utilisateur
  deleteMember(pseudo: string): Observable<void> {
    return this.http.delete<void>(`${this.rootURL + '/user'}/${pseudo}`);
  }  //récupérer erreur


  //constructor() { }
}
