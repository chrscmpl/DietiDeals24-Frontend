import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'dd24-logo',
    standalone: true,
    imports: [],
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
})
export class LogoComponent {
    constructor(private router: Router) {}

    goToHomePage() {
        this.router.navigate(['/home']);
    }
}
