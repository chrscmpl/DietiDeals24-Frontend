import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
    selector: 'dd24-social-registration-page',
    standalone: true,
    imports: [],
    templateUrl: './social-registration-page.component.html',
    styleUrl: './social-registration-page.component.scss',
})
export class SocialRegistrationPageComponent implements OnInit {
    public user!: SocialUser;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly http: HttpClient,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['user'];
            this.http
                .post('oauth/google/debug', { oauthToken: this.user.authToken })
                .subscribe();
        });
    }
}
