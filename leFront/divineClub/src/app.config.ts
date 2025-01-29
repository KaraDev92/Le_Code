import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { routes } from './app.routes';

registerLocaleData(localFr, 'fr-FR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    {				
      provide: LOCALE_ID,
      useValue: 'fr-FR'		
    },
    provideHttpClient()
  ]
};
