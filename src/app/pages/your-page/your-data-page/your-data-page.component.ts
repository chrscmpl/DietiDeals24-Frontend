import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'dd24-your-data-page',
    standalone: true,
    imports: [],
    templateUrl: './your-data-page.component.html',
    styleUrl: './your-data-page.component.scss',
})
export class YourDataPageComponent {
    public readonly tabs: MenuItem[] = [
        {
            label: 'Public profile',
        },
        {
            label: 'Links',
        },
        {
            label: 'Private information',
        },
        {
            label: 'Payment methods',
        },
        {
            label: 'Security & Privacy',
        },
    ];
}
