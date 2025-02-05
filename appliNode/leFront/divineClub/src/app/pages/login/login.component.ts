import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private authService: AuthService = inject(AuthService);

  // Service DataXchange à injecter ? pour sendLogin()

  sendLogin(form: NgForm) {
    const pseudo = form.value.pseudo;
    if (form.invalid) return;  // si form invalide se passe rien
    //sinon
    this.authService.sendLogin(form.value).subscribe({
      next: () => { //appelle la page profil si authService est d'accord (token)
        this.router.navigateByUrl('/profile', pseudo) //comment passer la variable pseudo ??? avec un signal ou observable ?
      },
      error: (err) => {    // gestion d'erreur d'indentification A compléter
      //   this.toast.error('Identifiants incorrects');
        console.log('Identifiants incorrects : ', err)
      }
    })
  }
}
