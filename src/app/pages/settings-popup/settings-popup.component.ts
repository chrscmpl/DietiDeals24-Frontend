import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ThemeSettingsComponent } from './theme-settings/theme-settings.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dd24-settings-popup',
    standalone: true,
    imports: [
        DialogModule,
        RouterOutlet,
        TabMenuModule,
        ThemeSettingsComponent,
    ],
    templateUrl: './settings-popup.component.html',
    styleUrl: './settings-popup.component.scss',
})
export class SettingsPopupComponent {
    constructor(private router: Router) {}

    public display: boolean = true;

    public tabs: MenuItem[] = [{ label: 'Theme', icon: 'pi pi-palette' }];

    public activeItem: MenuItem = this.tabs[0];

    public onClose(): void {
        this.router.navigate([{ outlets: { overlay: null } }]);
    }
}
