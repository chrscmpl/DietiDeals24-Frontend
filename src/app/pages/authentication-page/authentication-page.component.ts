import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
@Component({
    selector: 'dd24-authentication-page',
    standalone: true,
    imports: [LogoComponent],
    templateUrl: './authentication-page.component.html',
    styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent {
    constructor(private location: Location) {}

    goBack() {
        this.location.back();
    }
}
