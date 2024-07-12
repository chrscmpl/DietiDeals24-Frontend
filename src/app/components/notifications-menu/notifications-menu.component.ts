import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { NotificationComponent } from './notification/notification.component';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../services/notifications.service';

@Component({
    selector: 'dd24-notifications-menu',
    standalone: true,
    imports: [
        BadgeModule,
        AsyncPipe,
        OverlayPanelModule,
        NotificationComponent,
        DividerModule,
    ],
    templateUrl: './notifications-menu.component.html',
    styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    @ViewChild('panel') private panel!: OverlayPanel;

    public constructor(
        public readonly authentication: AuthenticationService,
        public readonly notificationsService: NotificationsService,
    ) {}

    public ngAfterViewInit(): void {
        this.subscriptions.push(this.panel.onShow.subscribe(() => {}));
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public toggle(event: Event): void {
        this.panel.toggle(event);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.panel.toggle(event);
        }
    }
}
