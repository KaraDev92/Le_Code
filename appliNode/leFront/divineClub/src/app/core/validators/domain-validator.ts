import { AbstractControl } from '@angular/forms';

//validateur d'adresse mail : pas de boite jetable
const trashEmailAddress: Array<string> = [
     'yopmail.com',  
     'jetable.org',  
     'guerrillamail.com',  
     'mailinator.com',  
     'trashmail.com',  
     'tempmail.com',  
     '10minutemail.com',  
     'maildrop.cc'
];

export function domainValidator(control: AbstractControl<string>): { invalidDomain: boolean } | null {
     return trashEmailAddress.some(host => control.value.endsWith(host)) ? {invalidDomain: true} : null;
}
