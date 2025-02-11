import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { ErrorMessageComponent } from "../../features/error-message/error-message.component";
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../core/interfaces/post';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent, DatePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private dataXchange = inject(DataXchangeService);
  private authService = inject(AuthService);
  private subscription!: Subscription;
  private subscription2!: Subscription;


  //variable memberSi est un signal
  memberSi = this.dataXchange.member;
  errorMessage: string = '';
  searchFriendInput = '';
  titlePostInput = '';
  txtPostInput = '';
  afficheCreerPost = false;
  afficheRechercherAmi = false;
  
  afficher(fenetre:string):void {
    if (fenetre === 'pourAmi') {
      this.afficheRechercherAmi = !this.afficheRechercherAmi;
    }
    if (fenetre === 'pourPost') {
      this.afficheCreerPost = !this.afficheCreerPost;
    }
  }

  searchFriend() {
    console.log('membre recherché : ', this.searchFriendInput);
  }

  poster() {
    console.log('post :', this.titlePostInput, this.txtPostInput);
    const newPost: Post = {
      date: new Date,
      auteur: '',
      titre: this.titlePostInput,
      contenu: this.txtPostInput
    };
    
    this.subscription2 = this.dataXchange.newPosting(newPost).subscribe({
      error: (err) => {
        if (err.status === 500) {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (err.status === 401) {
          this.errorMessage = "Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre profil."; 
          this.authService.logout();
        }
      }
    });
  }

  ngOnInit(): void {
    //récupère les données de member
    this.subscription = this.dataXchange.getMember().subscribe({
      error: (err) => {  
        if (err === 'Error: 500') {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (err === 'Error: 401') {
          this.errorMessage = "Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre profil."; 
          this.authService.logout();
        }
      }
    });
    console.log('data de memberSi : ', this.memberSi());

  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
  }


}
