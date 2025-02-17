import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { ErrorMessageComponent } from "../../features/error-message/error-message.component";
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Post } from '../../core/interfaces/post';
import { RouterLink } from '@angular/router';

//page de profil
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent, DatePipe, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private dataXchange = inject(DataXchangeService);
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;

  //variable memberSi est un signal
  memberSi = this.dataXchange.member;
  errorMessage: string = '';
  afficheCreerPost = false;
  afficheRechercherAmi = false;
  
  //gestion affichage de fenêtres
  afficher(fenetre: string):void {
    if (fenetre === 'pourAmi') {
      this.afficheRechercherAmi = !this.afficheRechercherAmi;
    }
    if (fenetre === 'pourPost') {
      this.afficheCreerPost = !this.afficheCreerPost;
    }
  }

  //pour aller sur la page d'un ami ou autre membre
  goToFriendPage(ami: string) {
    const amiRecherche = {pseudo: ami};
    this.subscription3 = this.dataXchange.searchFriend(amiRecherche).subscribe({
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

  //pour supprimer un ami
  deleteFriend(ami: string) {
    const amiRecherche: { pseudo: string } = { pseudo: ami };
    this.subscription3 = this.dataXchange.deleteFriend(amiRecherche).subscribe({
      next:() => {
        this.errorMessage = ami + " a été supprimé de vos amis.";
      },
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

  //pour chercher un ami ou un autre membre
  searchFriend(form: NgForm) {
    console.log('membre recherché : ', form.value.searchFriendInput);
    if (form.invalid) {
      this.errorMessage = "Données saisies invalides";
      return
    }
    const amiRecherche = {pseudo: form.value.searchFriendInput};
    this.subscription3 = this.dataXchange.searchFriend(amiRecherche).subscribe({
      error: (err) => {
        const erreur = String(err);
        console.log('erreur reçue dans le composant profile : ', erreur);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 418") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  }

  //pour envoyer un post sur son mur
  poster(form: NgForm) {
    console.log('post :', form.value.titrePostInput, form.value.txtPostInput);
    const newPost: Post = {
      date: new Date,
      auteur: '',
      titre: form.value.titrePostInput,
      contenu: form.value.txtPostInput
    };
    
    if (form.invalid) {
      this.errorMessage = "Données saisies invalides";
      return
    }
    this.subscription2 = this.dataXchange.newPosting(newPost).subscribe({
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    });
  
    form.reset();
  }

  //pour effacer un post de son mur
  deletePost(date: Date) {
    this.dataXchange.deletePost(date).subscribe({
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    })
  };

  ngOnInit(): void {
    //récupère les données de member
    this.subscription = this.dataXchange.getMember().subscribe({
      error: (err) => {  
        const erreur = String(err);
        if (erreur === "Error: 502") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    });
    console.log('data de memberSi : ', this.memberSi());
  } 

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
    this.subscription3?.unsubscribe();
  }


}
