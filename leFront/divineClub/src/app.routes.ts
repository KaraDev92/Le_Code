import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { LoginComponent } from './app/pages/login/login.component';
import { NotFoundComponent } from './app/pages/not-found/not-found.component';
import { CreateAccountComponent } from './app/pages/create-account/create-account.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'createaccount',
        component: CreateAccountComponent
    },
    {
        path: '**',  // cette route doit rester à la fin de la liste
        component: NotFoundComponent
    }

];
