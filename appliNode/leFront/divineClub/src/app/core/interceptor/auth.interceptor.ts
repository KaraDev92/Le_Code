import { HttpHandlerFn, HttpEvent, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, tap } from 'rxjs';
import { inject } from '@angular/core';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const auth = inject(AuthService);
  const token = auth.token()

  if (!token) {
    return next(req)
  }

  const headers = new HttpHeaders({
    Authorization: token
  })

  const newReq = req.clone({
    headers
  })

  return next(newReq).pipe(
    tap(evt => {
      console.log('Réponse reçue : ', evt);
    }),
    catchError(error => {
      console.log('Une erreur est survenue sur requête HTTP : ', error);
      throw new Error('Erreur personnalisée');
    })
  )
}

