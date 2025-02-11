import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ErrorMessageComponent } from '../../features/error-message/error-message.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);
  errorMessage: string = '';

  sendLogin(form: NgForm) {
    // si form invalide message d'erreur et rien 
    if (form.invalid) {
      this.errorMessage = "Données saisies invalides";
      return;
    } 
    //sinon
    this.authService.sendLogin(form.value).subscribe({
      //appelle la page profil si authService est d'accord (token reçu)
      next: () => { 
        this.router.navigateByUrl('/profile')
      },
      //message d'erreur en fonction de l'erreur reçue
      error: (err) => {  
        if (err.status === 401) {
          this.errorMessage = "Identifiants incorrects";
        }
        if (err.status === 500) {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    })
  }
}
