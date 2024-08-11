import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-settings-popup',
    standalone: true,
    imports: [
        DialogModule,
        RouterOutlet,
        TabMenuModule,
        ThemeSettingsComponent,
        AsyncPipe,
    ],
    templateUrl: './settings-popup.component.html',
    styleUrl: './settings-popup.component.scss',
})
export class SettingsPopupComponent {
    public display: boolean = true;

    public tabs: MenuItem[] = [
        {
            label: 'Theme',
            icon: 'pi pi-palette',
            routerLink: ['theme'],
        },
    ];

    public activeItem: MenuItem = this.tabs[0];

    constructor(
        private readonly router: Router,
        public readonly windowService: WindowService,
    ) {}

    public onClose(): void {
        this.router.navigate([{ outlets: { overlay: null } }], {
            queryParamsHandling: 'merge',
        });
    }
}
