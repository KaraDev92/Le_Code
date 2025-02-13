import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { ErrorMessageComponent } from "../../features/error-message/error-message.component";
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Post } from '../../core/interfaces/post';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ErrorMessageComponent, DatePipe, FormsModule],
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
  
  afficher(fenetre: string):void {
    if (fenetre === 'pourAmi') {
      this.afficheRechercherAmi = !this.afficheRechercherAmi;
    }
    if (fenetre === 'pourPost') {
      this.afficheCreerPost = !this.afficheCreerPost;
    }
  }

  goToFriendPage(ami: string) {
    const amiRecherche = {pseudo: ami};
    this.subscription3 = this.dataXchange.searchFriend(amiRecherche).subscribe({
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 500") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 404") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  };

  deleteFriend(ami: string) {
    const amiRecherche: { pseudo: string } = { pseudo: ami };
    this.subscription3 = this.dataXchange.deleteFriend(amiRecherche).subscribe({
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 500") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 404") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  };

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
        if (erreur === "Error: 500") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
        if (erreur === "Error: 404") {
          this.errorMessage = "Ami non trouvé";
        }
      }
    });
  }

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
        if (erreur === "Error: 500") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    });
  
    form.reset();
  }

  ngOnInit(): void {
    //récupère les données de member
    this.subscription = this.dataXchange.getMember().subscribe({
      error: (err) => {  
        const erreur = String(err);
        if (erreur === "Error: 500") {
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
