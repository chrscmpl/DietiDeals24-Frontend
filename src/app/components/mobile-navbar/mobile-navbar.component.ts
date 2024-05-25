import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, map, startWith } from 'rxjs';
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
        private readonly authenticationService: AuthenticationService,
    ) {}

    public profilePicture$: Observable<string | null> =
        this.authenticationService.loggedUser$.pipe(
            startWith(null),
            map((user) => user?.profilePictureUrl ?? null),
        );
}
