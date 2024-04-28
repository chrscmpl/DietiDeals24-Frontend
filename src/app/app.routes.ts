import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: LoginPageComponent },
  { path: 'auth', component: AuthenticationPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
