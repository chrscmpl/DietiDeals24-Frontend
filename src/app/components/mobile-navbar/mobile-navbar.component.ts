import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-mobile-navbar',
    standalone: true,
    imports: [AvatarModule, RouterLink, AsyncPipe],
    templateUrl: './mobile-navbar.component.html',
    styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {
    public constructor(
        public readonly authenticationService: AuthenticationService,
    ) {}
}
