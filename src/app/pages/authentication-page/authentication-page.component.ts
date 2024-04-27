import { Component } from '@angular/core';
import { ArrowBackButtonComponent } from '../../components/arrow-back-button/arrow-back-button.component';

@Component({
  selector: 'dd24-authentication-page',
  standalone: true,
  imports: [ArrowBackButtonComponent],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.scss'
})
export class AuthenticationPageComponent {

}
