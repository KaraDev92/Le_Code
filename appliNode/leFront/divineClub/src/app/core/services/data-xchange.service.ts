import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { Member } from '../interfaces/member';
import { NewMember } from '../interfaces/new-member';
import { Post } from '../interfaces/post';
import { Friend } from '../interfaces/friend';
import { ROOT_URL } from '../../../app.config';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataXchangeService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly rootURL = inject(ROOT_URL);

  //members = signal<Member[]>([]);
  
  member = signal<Member>({
    pseudo: '',
    //avatar: '',
    type_deite: '',
    pantheon: '',
    amis: [{pseudo: '', pantheon: '', type_deite: '', amis: [], mur: [], presentation: ''}],
    mur:[{auteur:'', date: new Date(), titre:'', contenu:''}],
    date_derniere_connexion: new Date(),
    presentation: ''
  });
  


  friend = signal<Friend>({
    pseudo: '',
    pantheon: '',
    type_deite: '',
    amis: [{pseudo: '', pantheon: '', type_deite: '', amis: [], mur: [], presentation: ''}],
    mur:[{auteur:'', date: new Date(), titre:'', contenu:''}],
    presentation: ''
  });

  //récupère tous les membres !!! pour l'admin 
  // getMembers(): Observable<Member[]> {
  //   return this.http.get<Member[]>(this.rootURL + '/users').pipe(
  //     tap(members => this.members.set(members)),
  //     catchError(error => {
  //       console.error('Erreur lors de la récupération des utilisateurs', error);
  //       throw error;
  //     })
  //   );
  // }


  //GET pour récupérer 1 membre pour page profil
  getMember(): Observable<Member> {
    return this.http.get<Member>(this.rootURL + '/user').pipe(
      tap((leMember) => {
        this.member.set(leMember);
      }),
      catchError (error => {
        console.log('Erreur de récup du profil : ', error);
        throw new Error(error);
      })
    )  
  };

  // GET pour chercher un membre 
  searchFriend(amiRecherche: object): Observable<Friend> {
    return this.http.post<Friend>(this.rootURL +'/searchmember', amiRecherche).pipe(
      tap((ami) => {
        this.friend.set(ami);
        this.router.navigateByUrl('/friend');
      }),
      catchError (error => {
        console.log('Erreur de recherche d\'ami : ', error);
        throw new Error(error);
    }))
  };

  // POST formulaire pour créer un nouvel utilisateur
  createMember(newMember: NewMember) {
    return this.http.post<NewMember>(this.rootURL + '/newuser', newMember);
  }  //récupérer erreur

  // PUT - Mettre à jour un utilisateur
  //ajout d'un post
  newPosting(newPost: Post): Observable<Member> {
    this.member.update((member) => {
      member.mur.push(newPost);
      return member;
    });
    return this.http.put<Member>(this.rootURL + '/userpost', newPost).pipe(
      catchError (error => {
        console.log('Erreur de nouveau post : ', error);
        throw new Error(error);
      })
    )
  };

  //supprimer un ami
  deleteFriend(amiRecherche: object): Observable<Member> {
    console.log('pseudo recherché : ', amiRecherche);
    this.member.update((member) => {
      member.amis.filter((ami) => ami.pseudo !== amiRecherche.pseudo);
      return member;
    });
    return this.http.put<Member>(this.rootURL + '/deletefriend', amiRecherche).pipe(
      catchError (error => {
        console.log('Erreur de suppression d\'ami : ', error);
        throw new Error(error);
      })
    )
  };

  
  // DELETE - Supprimer un utilisateur
  // deleteMember(pseudo: string): Observable<void> {
  //   return this.http.delete<void>(`${this.rootURL + '/user'}/${pseudo}`);
  // }  //récupérer erreur


  //constructor() { }
}
