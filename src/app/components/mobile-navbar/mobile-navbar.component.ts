import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dd24-mobile-navbar',
    standalone: true,
    imports: [AvatarModule, RouterLink],
    templateUrl: './mobile-navbar.component.html',
    styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public profilePicture: string | null = null;

    public constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.authenticationService.isLogged$.subscribe((isLogged) => {
                if (!isLogged) this.profilePicture = null;
                this.profilePicture =
                    this.authenticationService.loggedUser?.profilePictureUrl ??
                    null;
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
