import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SearchSectionComponent } from '../search/search-section/search-section.component';
import { RouterLink } from '@angular/router';
import { RoutingUtilsService } from '../../services/routing-utils.service';
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: 'dd24-header',
    standalone: true,
    imports: [SearchSectionComponent, RouterLink, TitleCasePipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
    constructor(
        public userService: UserService,
        public routingUtils: RoutingUtilsService
    ) {}

    ngOnInit(): void {
        console.log('header :)');
    }

    tabs: { name: string; url: string }[] = [
        { name: 'Home', url: 'home' },
        { name: 'Your Page', url: 'your-page' },
        { name: 'Create Auction', url: 'create-auction' },
        { name: 'Security & Privacy', url: 'your-page' },
        { name: 'Help', url: 'help' },
    ];
}
