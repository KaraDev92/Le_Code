import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { domainValidator } from '../../core/validators/domain-validator';
import { DataXchangeService } from '../../core/services/data-xchange.service';
import { NewMember } from '../../core/interfaces/new-member';
import { ErrorMessageComponent } from '../../features/error-message/error-message.component';
import { Router } from '@angular/router';
import { emailExists } from '../../core/validators/email-validator';
import { pseudoExists } from '../../core/validators/pseudo-validator';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  private dataXchange = inject(DataXchangeService);
  private router = inject(Router);
  errorMessage: string = '';
  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    pseudo: new FormControl('', [Validators.required, Validators.minLength(5)], [pseudoExists()]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30), 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*,?&_-])[A-Za-z\d@$!%*,?&_-]{1,}$/)]),
    email: new FormControl('', 
      [Validators.required, Validators.email, domainValidator], [emailExists()]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pantheon: new FormControl('', [Validators.required]),
    divinity: new FormControl('', [Validators.required])//,
    //avatar: new FormControl('', [Validators.required])
  })

  sentFormData() {
    if (this.form.invalid) return; //si formulaire pas valide rien
  
    // sinon on envoie le formulaire
    const formValue = this.form.value as NewMember;
    console.log('this.form.value typé comme NewMember', formValue);
    this.dataXchange.createMember(formValue).subscribe({
      next: () => { 
        //si ok du serveur on envoie à la page login
        this.router.navigateByUrl('/login')
      },
      error: (err) => {
        const erreur = String(err);
        if (erreur === "Error: 502" || erreur === "Error: 400") {
          this.errorMessage = "Nous rencontrons un problème, veuillez réessayer plus tard ...";
        }
      }
    });
    this.form.reset();
    
  }
}
