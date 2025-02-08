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
    if (form.invalid) return;  // si form invalide se passe rien
    //sinon
    this.authService.sendLogin(form.value).subscribe({
      next: () => { //appelle la page profil si authService est d'accord (token)
        this.router.navigateByUrl('/profile')
      },
      error: (err) => {    // gestion d'erreur d'indentification A compléter
      //   this.toast.error('Identifiants incorrects');
        console.log('Identifiants incorrects : ', JSON.stringify(err));
        if (err.status === 403) {
          this.errorMessage = "Identifiants incorrects";
        }
      }
    })
  }
}
