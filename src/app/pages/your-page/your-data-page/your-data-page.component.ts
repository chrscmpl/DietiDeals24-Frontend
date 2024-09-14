import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EditUserDataFormComponent } from '../../../components/edit-user-data-form/edit-user-data-form.component';
import { WindowService } from '../../../services/window.service';

@Component({
    selector: 'dd24-your-data-page',
    standalone: true,
    imports: [EditUserDataFormComponent],
    templateUrl: './your-data-page.component.html',
    styleUrl: './your-data-page.component.scss',
})
export class YourDataPageComponent {
    public readonly tabs: MenuItem[] = [
        {
            label: 'Public profile',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-public-profile'),
        },
        {
            label: 'Links',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-links'),
        },
        {
            label: 'Private information',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-private-info'),
        },
        {
            label: 'Payment methods',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('yd-payment-methods'),
        },
        {
            label: 'Security & Privacy',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor(
                    'yd-security-privacy',
                ),
        },
    ];

    public constructor(public readonly windowService: WindowService) {}
}
