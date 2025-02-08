import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Member } from '../interfaces/member';
import { NewMember } from '../interfaces/new-member';
//import { LoginM } from '../interfaces/loginM';
import { ROOT_URL } from '../../../app.config';


@Injectable({
  providedIn: 'root'
})
export class DataXchangeService {
  private http = inject(HttpClient);
  //members = signal<Member[]>([]);
  member = signal<Member>({
    pseudo: '',
    admin: false,
    //avatar: '',
    divinity: '',
    pantheon: '',
    friends: ''
  });
  private readonly rootURL = inject(ROOT_URL);

  //récupère tous les membres !!! pour l'admin ?
  // getMembers(): Observable<Member[]> {
  //   return this.http.get<Member[]>(this.rootURL + '/users').pipe(
  //     tap(members => this.members.set(members)),
  //     catchError(error => {
  //       console.error('Erreur lors de la récupération des utilisateurs', error);
  //       throw error;
  //     })
  //   );
  // }


  //GET pour récupèrer 1 membre pour page profil
  getMember(): Observable<Member> {
    return this.http.get<Member>(`${this.rootURL + '/user'}`).pipe(
      tap(leMember => console.log('Données du membre chargées : ', leMember))
    );
  }  //récupérer erreur

  // POST formulaire pour créer un nouvel utilisateur
  createMember(newMember: NewMember) {
    return this.http.post<NewMember>(this.rootURL + '/newuser', newMember);
  }  //récupérer erreur

  // PATCH - Mettre à jour partiellement un utilisateur
  // patchMember(pseudo: string, changes: Partial<Member>): Observable<Member> {
  //   return this.http.patch<Member>(`${this.rootURL + '/user'}/${pseudo}`, changes);
  // }  //récupérer erreur
  
  // DELETE - Supprimer un utilisateur
  // deleteMember(pseudo: string): Observable<void> {
  //   return this.http.delete<void>(`${this.rootURL + '/user'}/${pseudo}`);
  // }  //récupérer erreur


  //constructor() { }
}
