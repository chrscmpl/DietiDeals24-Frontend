import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { UserSummary } from '../../models/user.model';

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

    public onProfilePictureError(): void {
        this.showProfilePicturePlaceholder = true;
    }
}
