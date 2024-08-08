import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { link, mainPages } from '../../helpers/links';
import { ButtonModule } from 'primeng/button';
import { WindowService } from '../../services/window.service';
import { LogoComponent } from '../logo/logo.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { NotificationsMenuComponent } from '../notifications-menu/notifications-menu.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'dd24-header',
    standalone: true,
    imports: [
        SearchSectionComponent,
        RouterLink,
        RouterLinkActive,
        TitleCasePipe,
        AsyncPipe,
        ButtonModule,
        TitleCasePipe,
        LogoComponent,
        BreadcrumbComponent,
        UserMenuComponent,
        NotificationsMenuComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        public readonly authenticationService: AuthenticationService,
        public readonly windowService: WindowService,
        public readonly navigation: NavigationService,
    ) {}

    tabs: link[] = mainPages;
}
