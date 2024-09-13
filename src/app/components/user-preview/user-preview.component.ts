import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { UserSummary } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'dd24-user-preview',
    standalone: true,
    imports: [AvatarModule],
    templateUrl: './user-preview.component.html',
    styleUrl: './user-preview.component.scss',
})
export class UserPreviewComponent {
    @Input({ required: true }) user!: UserSummary;
    @Input() country?: string;
    @Input() city?: string;

    public showProfilePicturePlaceholder: boolean = false;

    public constructor(private readonly router: Router) {}

    public onProfilePictureError(): void {
        this.showProfilePicturePlaceholder = true;
    }

    public navigateToUser(): void {
        this.router.navigate([
            {
                outlets: {
                    overlay: null,
                    primary: ['users', this.user.id],
                },
            },
        ]);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') this.navigateToUser();
    }
}
