import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'dd24-user-preview',
    standalone: true,
    imports: [AvatarModule],
    templateUrl: './user-preview.component.html',
    styleUrl: './user-preview.component.scss',
})
export class UserPreviewComponent {
    @Input() profilePictureUrl?: string | null | undefined;
    @Input({ required: true }) username!: string;
    @Input({ required: true }) country!: string;
    @Input({ required: true }) city!: string;

    public showProfilePicturePlaceholder: boolean = false;

    public onProfilePictureError(): void {
        this.showProfilePicturePlaceholder = true;
    }
}
