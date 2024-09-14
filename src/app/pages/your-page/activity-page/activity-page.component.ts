import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { UserInformationCardComponent } from '../../../components/user-information-card/user-information-card.component';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { WindowService } from '../../../services/window.service';
import { AuthenticatedUser } from '../../../models/authenticated-user.model';
import { Subscription, take } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';

@Component({
    selector: 'dd24-activity-page',
    standalone: true,
    imports: [
        RouterOutlet,
        UserInformationCardComponent,
        AsyncPipe,
        ButtonModule,
        RouterLink,
        TabMenuModule,
    ],
    templateUrl: './activity-page.component.html',
    styleUrl: './activity-page.component.scss',
})
export class ActivityPageComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription[] = [];
    public userData!: AuthenticatedUser;
    public showPastActivityButton: boolean = false;

    public readonly tabs: MenuItem[] = [
        {
            label: 'Current',
            routerLink: ['current'],
        },
        {
            label: 'History',
            routerLink: ['past'],
        },
    ];

    public constructor(
        private readonly route: ActivatedRoute,
        public readonly windowService: WindowService,
        private readonly navigation: NavigationService,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.userData = data['userData'];
        });

        this.route.children[0]?.url.subscribe((url) => {
            this.showPastActivityButton = url[0]?.path !== 'past';
        });

        this.subscriptions.push(
            this.navigation.navigationStart$.subscribe((e) => {
                this.showPastActivityButton = !e?.url?.endsWith('past');
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
