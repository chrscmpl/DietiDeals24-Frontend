import { Injectable } from '@angular/core';
import {
    DisplayableNotification,
    Notification,
} from '../models/notification.model';
import {
    PaginatedRequest,
    PaginatedRequestParams,
} from '../helpers/paginatedRequest';
import { NotificationDTO } from '../DTOs/notification.dto';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { AuthenticationService } from './authentication.service';
import { Observable, Subject } from 'rxjs';

type NotificationsPaginationParams = Omit<
    PaginatedRequestParams<DisplayableNotification>,
    'http' | 'factory' | 'url' | 'queryParameters'
>;

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private static readonly PAGE_SIZE = 9;
    private request: PaginatedRequest<DisplayableNotification> | null = null;
    private _unreadNotificationsCount = 0;
    public readonly notifications: DisplayableNotification[] = [];
    private moreLoadedSubject: Subject<void> = new Subject<void>();
    public moreLoaded$: Observable<void> = new Observable<void>();

    constructor(
        private readonly http: HttpClient,
        private readonly env: EnvironmentService,
        private readonly authentication: AuthenticationService,
    ) {
        this.authentication.isLogged$.subscribe((logged) => {
            if (logged) {
                this.request = this.getDisplayableNotificationsRequest({
                    pageSize: NotificationsService.PAGE_SIZE,
                    pageNumber: 1,
                    eager: false,
                });
                this._unreadNotificationsCount =
                    this.authentication.loggedUser
                        ?.unreadNotificationsCounter ?? 0;
                this.request.data$.subscribe((notifications) => {
                    this.notifications.push(...notifications);
                    this.moreLoadedSubject.next();
                });
                this.more();
            } else {
                this.notifications.splice(0, this.notifications.length);
                this.request?.complete();
                this.request = null;
            }
        });
    }

    public refresh(): void {
        this.notifications.splice(0, this.notifications.length);
        if (this.request === null) return;

        this.request?.reset();
        this.request?.data$.subscribe((notifications) =>
            this.notifications.push(...notifications),
        );
        this.more();
    }

    public more(): void {
        if (this.request === null || this.request.isComplete) return;

        this.request.more();
    }

    public markAsRead(notification: DisplayableNotification): void {
        if (notification.read) return;
        notification.read = true;
        this._unreadNotificationsCount--;
        this.http.post(
            `${this.env.server}/notifications/${notification.id}/read`,
            {},
        );
    }

    public markAllAsRead(): void {
        this.notifications.forEach(
            (notification) => (notification.read = true),
        );
        this._unreadNotificationsCount = 0;
        this.http.post(`${this.env.server}/notifications/read`, {});
    }

    public deleteOne(notification: DisplayableNotification): void {
        const index = this.notifications.findIndex(
            (n) => n.id === notification.id,
        );
        if (index === -1) return;
        if (!notification.read) this._unreadNotificationsCount--;
        this.notifications.splice(index, 1);
        this.http.delete(`${this.env.server}/notifications/${notification.id}`);
    }

    public deleteAll(): void {
        this.notifications.splice(0, this.notifications.length);
        this._unreadNotificationsCount = 0;
        this.http.delete(`${this.env.server}/notifications`);
    }

    public get unreadNotificationsCount(): number {
        return this._unreadNotificationsCount;
    }

    private getDisplayableNotificationsRequest(
        params: NotificationsPaginationParams,
    ): PaginatedRequest<DisplayableNotification> {
        return new PaginatedRequest<DisplayableNotification>(
            Object.assign(params, {
                http: this.http,
                url: `${this.env.server}/notifications`,
                factory: (dtos: NotificationDTO[]) =>
                    dtos.map(
                        (n) => new Notification(n),
                    ) as DisplayableNotification[],
                queryParameters: {},
            }),
        );
    }
}
