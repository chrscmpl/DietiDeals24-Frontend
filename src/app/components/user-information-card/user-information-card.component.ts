import { Component, Input } from '@angular/core';
import { AuthenticatedUser } from '../../models/user.model';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'dd24-user-information-card',
    standalone: true,
    imports: [AvatarModule, DividerModule, NgTemplateOutlet],
    templateUrl: './user-information-card.component.html',
    styleUrl: './user-information-card.component.scss',
})
export class UserInformationCardComponent {
    @Input({ required: true }) public user!: AuthenticatedUser;
    @Input() public privateView: boolean = false;

    public showImagePlaceholder: boolean = false;

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }
}
