import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: LoginPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
