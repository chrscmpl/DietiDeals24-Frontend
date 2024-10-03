import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { WindowService } from '../../services/window.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { filter, map, Subscription, withLatestFrom } from 'rxjs';
import { SocialLoginException } from '../../exceptions/social-login.exception';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'dd24-authentication-page',
    standalone: true,
    imports: [LogoComponent, AsyncPipe, RouterOutlet],
    templateUrl: './authentication-page.component.html',
    styleUrl: './authentication-page.component.scss',
})
export class AuthenticationPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly navigation: NavigationService,
        public readonly windowService: WindowService,
        private readonly authentication: AuthenticationService,
        private readonly socialAuthService: SocialAuthService,
        private readonly message: MessageService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        this.subscriptions.push(
            this.socialAuthService.authState
                .pipe(
                    withLatestFrom(this.authentication.isLogged$),
                    filter(([_, isLogged]) => !isLogged),
                    map(([user]) => user),
                )
                .subscribe((user) => {
                    if (!user) return;
                    this.authentication.loginUsingSocials(user).subscribe({
                        next: () =>
                            this.navigation.navigateToRouteBeforeRedirection(),
                        error: (e) => this.onSocialLoginError(e, user),
                    });
                }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription.unsubscribe(),
        );
    }

    public goBack(): void {
        this.navigation.back();
    }

    private onSocialLoginError(
        e: SocialLoginException,
        user: SocialUser,
    ): void {
        if (e.error.status === 409) {
            this.router.navigate(['login'], { relativeTo: this.route });
            this.message.add({
                severity: 'warn',
                summary: 'Log in using credentials',
                detail: 'Please log in using your credentials',
            });
            return;
        }

        if (e.error.status >= 500) {
            this.message.add({
                severity: 'error',
                summary: 'Server error',
                detail: 'An error occurred on the server. Please try again later',
            });
            return;
        }

        if (e.error.status === 0) {
            this.message.add({
                severity: 'error',
                summary: 'Network error',
                detail: 'Check your connection and try again',
            });
            return;
        }

        this.router.navigate(['social-registration'], {
            state: { user },
            relativeTo: this.route,
        });
    }
}
