import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { domainValidator } from '../../core/validators/domain-validator';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    pseudo: new FormControl('', [Validators.required, Validators.minLength(5)]),
    //rajouter un validateur asynchrone pour vérifier que le pseudo n'est pas déjà utilisé
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(30), 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_',-])[A-Za-z\d@$!%*?&_',-]$/)]),
    email: new FormControl('', [Validators.required, Validators.email, domainValidator]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pantheon: new FormControl('', [Validators.required]),
    divinity: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required])
  })

  sentFormData() {
    if (this.form.valid) {
      console.log('Formulaire soumis');
      console.log(this.form);
      const data = { ...this.form.value, page: 'contact' };
      console.log('data', data);
      this.form.reset();
    }
  }
}
