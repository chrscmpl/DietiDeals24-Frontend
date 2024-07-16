import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { NotificationsService } from '../../../services/notifications.service';
import { LoadingIndicator } from '../../../helpers/loadingIndicator';
import { Subscription } from 'rxjs';
import { DisplayableNotification } from '../../../models/notification.model';
import { Router } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'dd24-notifications-list',
    standalone: true,
    imports: [NotificationComponent, ProgressSpinnerModule, AsyncPipe],
    templateUrl: './notifications-list.component.html',
    styleUrl: './notifications-list.component.scss',
})
export class NotificationsListComponent implements AfterViewInit {
    private subscriptions: Subscription[] = [];

    public loadingIndicator: LoadingIndicator = new LoadingIndicator(0);

    @Input() listStyles: { [key: string]: string } = {};

    @Output() public readonly read: EventEmitter<DisplayableNotification> =
        new EventEmitter<DisplayableNotification>();

    @Output() public readonly empty: EventEmitter<void> =
        new EventEmitter<void>();

    @ViewChild('notificationsList')
    private notificationsList!: ElementRef;

    constructor(
        public readonly notificationsService: NotificationsService,
        private readonly router: Router,
    ) {}

    public ngAfterViewInit(): void {
        this.subscriptions.push(
            this.notificationsService.moreLoaded$.subscribe(() => {
                this.loadingIndicator.stop();
            }),
        );
    }

    public more(): void {
        if (this.notificationsService.isComplete) return;
        this.loadingIndicator.start();
        this.notificationsService.more();
    }

    public deleteNotification(notification: DisplayableNotification): void {
        this.notificationsService.deleteOne(notification);
        if (!this.notificationsService.notifications.length) {
            this.empty.emit();
        }
    }

    public onRead(notification: DisplayableNotification): void {
        this.read.emit(notification);
        this.router.navigate([notification.link]);
        if (!notification.read)
            this.notificationsService.markAsRead(notification);
    }
}
