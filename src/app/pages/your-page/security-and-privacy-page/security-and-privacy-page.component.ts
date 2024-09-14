import { Component, OnInit } from '@angular/core';
import { WindowService } from '../../../services/window.service';
import { MenuItem } from 'primeng/api';
import { EditUserDataFormComponent } from '../../../components/edit-user-data-form/edit-user-data-form.component';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
    selector: 'dd24-security-and-privacy-page',
    standalone: true,
    imports: [EditUserDataFormComponent],
    templateUrl: './security-and-privacy-page.component.html',
    styleUrl: './security-and-privacy-page.component.scss',
})
export class SecurityAndPrivacyPageComponent implements OnInit {
    public readonly tabs: MenuItem[] = [
        {
            label: 'Login & Security',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('sp-login-security'),
        },
        {
            label: 'TOS and Privacy Policy',
            command: () =>
                this.windowService.scrollSmoothlyToAnchor('sp-tos-pp'),
        },
    ];

    public termsOfServiceText?: string;

    public constructor(
        public readonly windowService: WindowService,
        private readonly route: ActivatedRoute,
    ) {}

    public ngOnInit(): void {
        this.route.data.pipe(take(1)).subscribe((data) => {
            this.termsOfServiceText = data['tos'];
        });
    }
}
