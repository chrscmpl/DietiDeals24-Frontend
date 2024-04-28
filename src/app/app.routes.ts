import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationPageComponent } from './pages/authentication-page/authentication-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { YourPageComponent } from './pages/your-page/your-page.component';
import { CreateAuctionPageComponent } from './pages/create-auction-page/create-auction-page.component';
import { HelpPageComponent } from './pages/help-page/help-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'your-page', component: YourPageComponent },
  { path: 'create-auction', component: CreateAuctionPageComponent },
  { path: 'help', component: HelpPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: LoginPageComponent },
  { path: 'auth', component: AuthenticationPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
