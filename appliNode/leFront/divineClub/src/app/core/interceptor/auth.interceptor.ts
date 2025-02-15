import { HttpHandlerFn, HttpEvent, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, tap } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.token()) {
    return next(req)
  }
  //console.log('requête interceptée : ', req);
  const headers = new HttpHeaders({
    Authorization: auth.token()
  });

  const newReq = req.clone({
    headers
  });
  //console.log('requête qui part pour de bon : ', newReq);
  return next(newReq).pipe(
    tap(evt => {
      console.log('Réponse reçue : ', evt);
    }),
    catchError(error => {
      //console.log('Une erreur est survenue sur requête HTTP : ', error);
      if (error.status === 401 || error.status === 403) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      if (error.status === 404) {
        router.navigateByUrl('/not-found');
      }

      throw new Error(error.status);
    })
  )
}

