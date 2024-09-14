import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'dd24-edit-user-data-form',
    standalone: true,
    imports: [MenuModule, AsyncPipe, ButtonModule],
    templateUrl: './edit-user-data-form.component.html',
    styleUrl: './edit-user-data-form.component.scss',
})
export class EditUserDataFormComponent {
    @Input() public tabs: MenuItem[] = [];

    public constructor(
        public readonly windowService: WindowService,
        public readonly navigation: NavigationService,
    ) {}
}
