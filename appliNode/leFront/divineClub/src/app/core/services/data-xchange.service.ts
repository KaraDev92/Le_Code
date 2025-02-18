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
    presentation: '',
    req_ami:[{pseudo:''}]
  });
  
  friend = signal<Friend>({
    pseudo: '',
    pantheon: '',
    type_deite: '',
    amis: [{pseudo: '', pantheon: '', type_deite: '', amis: [], mur: [], presentation: ''}],
    mur:[{auteur:'', date: new Date(''), titre:'', contenu:''}],
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
        throw error;
    }))
  };

  // POST 
  // formulaire pour créer un nouvel utilisateur
  createMember(newMember: NewMember): Observable<NewMember> {
    return this.http.post<NewMember>(this.rootURL + '/newuser', newMember).pipe(
      catchError (error => {
        console.log('Erreur de création de compte : ', error);
        throw new Error(error);
      })
    );
  }


  // PUT 
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
  deleteFriend(amiRecherche: { pseudo: string }): Observable<Member> {
    console.log('pseudo ami à supprimer : ', amiRecherche);
    return this.http.put<Member>(this.rootURL + '/deletefriend', amiRecherche).pipe(
      tap(() => {
        this.member.update((member) => {
          member.amis = member.amis.filter((ami) => ami.pseudo !== amiRecherche.pseudo);
          return member;
        });
      }),
      catchError (error => {
        console.log('Erreur de suppression d\'ami : ', error);
        throw new Error(error);
      })
    )
  };

  //requête pour effacer un post
  deletePost(ladate: Date): Observable<Member> {
    const post = {date: ladate};
    return this.http.put<Member>(this.rootURL + "/deletepost", post).pipe(
      tap(() => {
        this.member.update((member) => {
          member.mur = member.mur.filter((post) => post.date !== ladate);
          return member;
        })
      })
    )
  }; 

  //réponse à une demande d'ami
  respondFriendship(reponse: {rep: boolean, pseudo: string}): Observable<Member> {
    return this.http.put<Member>(this.rootURL + "/responsefriend", reponse).pipe(
      tap(() => {
        this.member.update((member) => {
          member.req_ami = member.req_ami.filter((req) => req.pseudo !== reponse.pseudo);
          return member;
        });
        if (reponse.rep === true) {
          this.member.update((member) => {
            member.amis.push({
              pseudo: reponse.pseudo,
              pantheon: '',
              type_deite: '',
              amis: [],
              mur: [],
              presentation: ''
            });
            return member;
          })
        } 
      })
    )
  };
  
  // DELETE - Supprimer son compte
  // deleteMember(pseudo: string): Observable<void> {
  //   return this.http.delete<void>(`${this.rootURL + '/user'}/${pseudo}`);
  // }  //récupérer erreur


  //constructor() { }
}
