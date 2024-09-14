import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'dd24-edit-user-data-form',
    standalone: true,
    imports: [MenuModule],
    templateUrl: './edit-user-data-form.component.html',
    styleUrl: './edit-user-data-form.component.scss',
})
export class EditUserDataFormComponent {
    @Input() public tabs: MenuItem[] = [];
}
