import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { UserInformationCardComponent } from '../../../components/user-information-card/user-information-card.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { WindowService } from '../../../services/window.service';
import { AuthenticatedUser } from '../../../models/user.model';
import { take } from 'rxjs';

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
export class ActivityPageComponent implements OnInit {
    public userData!: AuthenticatedUser;

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
    ) {}

    public ngOnInit(): void {
        this.route.parent?.data.pipe(take(1)).subscribe((data) => {
            this.userData = data['userData'];
        });
    }
}
