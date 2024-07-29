import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsListComponent } from '../../components/notifications-menu/notifications-list/notifications-list.component';
import { NotificationsService } from '../../services/notifications.service';
import { ButtonModule } from 'primeng/button';
import { WindowService } from '../../services/window.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-notifications-page',
    standalone: true,
    imports: [NotificationsListComponent, ButtonModule, AsyncPipe],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
    public constructor(
        public readonly notificationsService: NotificationsService,
        public readonly windowService: WindowService,
    ) {}

    ngOnInit(): void {
        this.notificationsService.lockRefresh(true);
    }

    ngOnDestroy(): void {
        this.notificationsService.lockRefresh(false);
    }
}
