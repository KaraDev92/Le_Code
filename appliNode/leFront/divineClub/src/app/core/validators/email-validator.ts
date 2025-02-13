import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ROOT_URL } from '../../../app.config';
import { catchError, Observable} from 'rxjs';



export function emailExists(): AsyncValidatorFn {
    const http = inject(HttpClient);
    const rootUrl = inject(ROOT_URL);
    return function (input: AbstractControl<string>): Observable<{ exists: boolean } | null> {
        return http.get<{ exists: boolean } | null>(rootUrl + '/checkemail/' + input.value).pipe(
            catchError (error => {
                console.log('Erreur de recherche d\'email : ', error);
                throw new error;
            })
        )
    }
    
}
