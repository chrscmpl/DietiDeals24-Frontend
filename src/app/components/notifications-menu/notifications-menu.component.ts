import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { AsyncPipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { NotificationComponent } from './notification/notification.component';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../services/notifications.service';
import { ButtonModule } from 'primeng/button';
import { ScrolledToBottomListenerDirective } from '../../directives/scrolled-to-bottom-listener.directive';
import { DisplayableNotification } from '../../models/notification.model';
import { Router } from '@angular/router';
import { LoadingIndicator } from '../../helpers/loadingIndicator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'dd24-notifications-menu',
    standalone: true,
    imports: [
        BadgeModule,
        AsyncPipe,
        OverlayPanelModule,
        NotificationComponent,
        DividerModule,
        ButtonModule,
        ScrolledToBottomListenerDirective,
        ProgressSpinnerModule,
    ],
    templateUrl: './notifications-menu.component.html',
    styleUrl: './notifications-menu.component.scss',
})
export class NotificationsMenuComponent implements AfterViewInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    @ViewChild('panel') private panel!: OverlayPanel;
    @ViewChild('notificationList') private notificationsList!: ElementRef;
    public loadingIndicator: LoadingIndicator = new LoadingIndicator(0);
    private minHeight =
        20 * parseFloat(getComputedStyle(document.documentElement).fontSize);

    public constructor(
        public readonly authentication: AuthenticationService,
        public readonly notificationsService: NotificationsService,
        private readonly router: Router,
    ) {}

    public ngAfterViewInit(): void {
        this.subscriptions.push(
            this.panel.onShow.subscribe(this.loadMoreIfTooShort.bind(this)),
        );

        this.subscriptions.push(
            this.notificationsService.moreLoaded$.subscribe(() => {
                this.loadingIndicator.stop();
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    public more(): void {
        if (this.notificationsService.isComplete) return;
        this.loadingIndicator.start();
        this.notificationsService.more();
    }

    public toggle(event: Event): void {
        this.panel.toggle(event);
    }

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            this.panel.toggle(event);
        }
    }

    public deleteNotification(notification: DisplayableNotification): void {
        this.notificationsService.deleteOne(notification);
        if (!this.notificationsService.notifications.length) {
            this.panel.hide();
        }
    }

    public onRead(notification: DisplayableNotification): void {
        this.panel.hide();
        this.router.navigate([notification.link]);
        if (!notification.read)
            this.notificationsService.markAsRead(notification);
    }

    private loadMoreIfTooShort(): void {
        setTimeout(() => {
            const height =
                this.notificationsList?.nativeElement.scrollHeight ?? Infinity;
            if (height < this?.minHeight) {
                this?.more();
            }
        }, 1000);
    }
}
