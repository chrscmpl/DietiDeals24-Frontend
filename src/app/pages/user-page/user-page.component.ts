import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
    UrlTree,
} from '@angular/router';
import { Subscription, take } from 'rxjs';
import { UserInformationCardComponent } from '../../components/user-information-card/user-information-card.component';
import { WindowService } from '../../services/window.service';
import { NavigationService } from '../../services/navigation.service';
import { MenuItem } from 'primeng/api';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { routerLinkType } from '../../typeUtils/router-link-type';

@Component({
    selector: 'dd24-user-page',
    standalone: true,
    imports: [
        UserInformationCardComponent,
        RouterOutlet,
        AsyncPipe,
        ButtonModule,
        TabMenuModule,
        RouterLink,
    ],
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    public user!: User;
    public showPastActivityButton: boolean = false;
    public previousRoute!: UrlTree;

    public readonly tabs: MenuItem[] = [
        {
            label: 'Current',
            routerLink: ['current-activity'],
        },
        {
            label: 'History',
            routerLink: ['past-activity'],
        },
    ];

    public constructor(
        private readonly route: ActivatedRoute,
        public readonly windowService: WindowService,
        public readonly navigation: NavigationService,
        public readonly router: Router,
    ) {}

    public ngOnInit(): void {
        this.previousRoute = this.navigation.lastRoute;

        this.route.data.pipe(take(1)).subscribe((data) => {
            this.user = data['user'];
        });

        this.route.children[0]?.url.subscribe((url) => {
            this.showPastActivityButton = url[0]?.path !== 'past-activity';
        });

        this.subscriptions.push(
            this.navigation.navigationStart$.subscribe((e) => {
                this.showPastActivityButton =
                    !e?.url?.endsWith('past-activity');
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
