import { Component } from '@angular/core';
import { NotificationsListComponent } from '../../components/notifications-menu/notifications-list/notifications-list.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
    selector: 'dd24-notifications-page',
    standalone: true,
    imports: [NotificationsListComponent],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent {
    public constructor(
        public readonly notificationsService: NotificationsService,
    ) {}
}
