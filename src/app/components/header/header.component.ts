import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SearchSectionComponent } from '../search/search-section/search-section.component';
import { RouterLink } from '@angular/router';
import { RoutingUtilsService } from '../../services/routing-utils.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { link, mainPages } from '../../helpers/links';

@Component({
    selector: 'dd24-header',
    standalone: true,
    imports: [SearchSectionComponent, RouterLink, TitleCasePipe, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        public authenticationService: AuthenticationService,
        public routingUtils: RoutingUtilsService,
    ) {}

    tabs: link[] = mainPages;
}
