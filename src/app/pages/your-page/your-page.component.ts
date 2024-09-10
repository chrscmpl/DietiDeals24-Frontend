import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dd24-your-page',
    standalone: true,
    imports: [RouterOutlet, AsyncPipe, TabMenuModule],
    templateUrl: './your-page.component.html',
    styleUrl: './your-page.component.scss',
})
export class YourPageComponent {
    public constructor(public readonly windowService: WindowService) {}

    public readonly tabs: MenuItem[] = [
        {
            label: 'Current activity',
            routerLink: ['activity', 'current'],
        },
        {
            label: 'Past activity',
            routerLink: ['activity', 'past'],
        },
        {
            label: 'Your data',
            routerLink: ['your-data'],
        },

        {
            label: 'Security & Privacy',
            routerLink: ['security-privacy'],
        },
    ];
}
