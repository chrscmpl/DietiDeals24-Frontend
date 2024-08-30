import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { NotificationsService } from '../../services/notifications.service';

@Component({
    selector: 'dd24-mobile-navbar',
    standalone: true,
    imports: [
        AvatarModule,
        RouterLink,
        AsyncPipe,
        BadgeModule,
        RouterLinkActive,
    ],
    templateUrl: './mobile-navbar.component.html',
    styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public showImagePlaceholder: boolean = true;

    public constructor(
        public readonly authenticationService: AuthenticationService,
        public readonly notificationsService: NotificationsService,
    ) {}

    public ngOnInit(): void {
        this.subscriptions.push(
            this.profilePicture$.subscribe(
                (pic) => (this.showImagePlaceholder = !pic),
            ),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public readonly profilePicture$: Observable<string | null> =
        this.authenticationService.loggedUser$.pipe(
            startWith(null),
            map((user) => user?.profilePictureUrl ?? null),
        );

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }
}
