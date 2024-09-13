import { Component, Input } from '@angular/core';
import { AuthenticatedUser } from '../../models/authenticated-user.model';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { NgTemplateOutlet } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
    selector: 'dd24-user-information-card',
    standalone: true,
    imports: [AvatarModule, DividerModule, NgTemplateOutlet],
    templateUrl: './user-information-card.component.html',
    styleUrl: './user-information-card.component.scss',
})
export class UserInformationCardComponent {
    private _user!: AuthenticatedUser | User;
    public _privateView: boolean = false;

    @Input({ required: true }) public set user(user: AuthenticatedUser | User) {
        this._user = user;
        this._privateView = user instanceof AuthenticatedUser;
    }

    public showImagePlaceholder: boolean = false;

    public onImageError(): void {
        this.showImagePlaceholder = true;
    }

    public get privateView(): boolean {
        return this._privateView;
    }

    public get user(): AuthenticatedUser | User {
        return this._user;
    }

    public get authenticatedUser(): AuthenticatedUser {
        return this.user as AuthenticatedUser;
    }

    public get nonAuthenticatedUser(): User {
        return this.user as User;
    }
}
