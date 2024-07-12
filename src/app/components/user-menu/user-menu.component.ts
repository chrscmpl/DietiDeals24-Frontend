import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AuthenticationService } from '../../services/authentication.service';
import { AvatarModule } from 'primeng/avatar';
import { AsyncPipe } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';

@Component({
    selector: 'dd24-user-menu',
    standalone: true,
    imports: [MenuModule, AvatarModule, AsyncPipe, TabViewModule],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
    public constructor(
        public readonly authentication: AuthenticationService,
        private readonly router: Router,
    ) {}

    public _isOpen: boolean = false;

    items: MenuItem[] = [
        {
            label: 'Your Page',
            routerLink: '/your-page',
            command: this.close.bind(this),
        },
        {
            label: 'Security & Privacy',
            routerLink: '/your-page/security-privacy',
            command: this.close.bind(this),
        },
        {
            label: 'Log out',
            command: () => {
                this.logout();
                this.close();
            },
        },
    ];

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.toggle();
        }
    }

    public get isOpen(): boolean {
        return this._isOpen;
    }

    private set isOpen(value: boolean) {
        this._isOpen = value;
    }

    public open(): void {
        this.isOpen = true;
    }

    public close(): void {
        this.isOpen = false;
    }

    public toggle(): void {
        this.isOpen = !this.isOpen;
    }

    private logout(): void {
        this.authentication.logout();
        this.router.navigate(['/']);
    }
}
