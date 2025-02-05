import { ApplicationConfig, provideZoneChangeDetection, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { routes } from './app.routes';
import { authInterceptor } from './app/core/interceptor/auth.interceptor';

registerLocaleData(localFr, 'fr-FR');

export const ROOT_URL = new InjectionToken<string>('ROOT_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    {				
      provide: LOCALE_ID,
      useValue: 'fr-FR'		
    },
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: ROOT_URL, useValue: 'http://localhost:3000' } 
  ]
};
