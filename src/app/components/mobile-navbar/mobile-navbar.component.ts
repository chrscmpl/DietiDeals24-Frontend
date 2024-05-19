import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DockModule } from 'primeng/dock';

@Component({
    selector: 'dd24-mobile-navbar',
    standalone: true,
    imports: [DockModule],
    templateUrl: './mobile-navbar.component.html',
    styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {
    public items: MenuItem[] = [
        { name: 'Home', routerLink: 'home', icon: 'pi pi-home' },
        {
            name: 'Search',
            routerLink: 'auctions',
            icon: 'pi pi-search',
        },
        {
            name: 'Create Auction',
            routerLink: 'create-auction',
            icon: 'pi pi-plus',
        },
        { name: 'Your Page', routerLink: 'your-page', icon: 'pi pi-user' },
        { name: 'Help', routerLink: 'help', icon: 'pi pi-question-circle' },
    ];
}
