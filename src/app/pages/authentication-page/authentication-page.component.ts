import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LogoComponent } from '../../components/logo/logo.component';
import { WindowService } from '../../services/window.service';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { filter, map, Subscription, withLatestFrom } from 'rxjs';
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
        private readonly router: Router,
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
                        error: () =>
                            this.router.navigate(
                                ['/auth/social-registration'],
                                {
                                    state: { user },
                                },
                            ),
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
}
