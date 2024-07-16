import { Injectable } from '@angular/core';
import { DisplayableNotification } from '../models/notification.model';
import {
    PaginatedRequest,
    PaginatedRequestParams,
} from '../helpers/paginatedRequest';
import { NotificationResponse } from '../DTOs/notification.dto';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { AuthenticationService } from './authentication.service';
import { map, Observable, Observer, ReplaySubject, Subject } from 'rxjs';
import { notificationsBuilder } from '../helpers/notificationBuilder';

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

    private _notificationsCount: number = 0;
    private _unreadNotificationsCount: number = 0;

    public readonly notifications: DisplayableNotification[] = [];

    private unreadNotificationsSubject: ReplaySubject<void> =
        new ReplaySubject<void>(1);
    public unreadNotificationsCount$: Observable<number> =
        this.unreadNotificationsSubject
            .asObservable()
            .pipe(map(() => this._unreadNotificationsCount));

    private loadingEndedSubject: Subject<void> = new Subject<void>();
    public loadingEnded$: Observable<void> =
        this.loadingEndedSubject.asObservable();

    private dataObserver: Observer<DisplayableNotification[]> = {
        next: (notifications) => {
            this.notifications.push(...notifications);
            this.loadingEndedSubject.next();
        },
        error: () => {
            this.loadingEndedSubject.next();
        },
        complete: () => {
            this.loadingEndedSubject.next();
        },
    };

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

                this.unreadNotificationsCount =
                    this.authentication.loggedUser
                        ?.unreadNotificationsCounter ?? 0;

                this.request.data$.subscribe(this.dataObserver);

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
        this.request?.data$.subscribe(this.dataObserver);
        this.more();
    }

    private temp: number = 0; // REMOVE

    public more(): void {
        if (this.request === null || this.request.isComplete) {
            this.loadingEndedSubject.next();
            return;
        }

        this.request.more();
    }

    public markAsRead(notification: DisplayableNotification): void {
        if (notification.read) return;
        notification.read = true;
        this.unreadNotificationsCount--;
        this.http.post(
            `${this.env.server}/notifications/${notification.id}/read`,
            {},
        );
    }

    public markAllAsRead(): void {
        this.notifications.forEach(
            (notification) => (notification.read = true),
        );
        this.unreadNotificationsCount = 0;
        this.http.post(`${this.env.server}/notifications/read`, {});
    }

    public deleteOne(notification: DisplayableNotification): void {
        const index = this.notifications.findIndex(
            (n) => n.id === notification.id,
        );
        if (index === -1) return;
        if (!notification.read) this.unreadNotificationsCount--;
        this.notifications.splice(index, 1);
        this.http.delete(`${this.env.server}/notifications/${notification.id}`);
    }

    public deleteAll(): void {
        this.notifications.splice(0, this.notifications.length);
        this.unreadNotificationsCount = 0;
        this.http.delete(`${this.env.server}/notifications`);
    }

    public get unreadNotificationsCount(): number {
        return this._unreadNotificationsCount;
    }

    public get isComplete(): boolean {
        return this.request?.isComplete ?? true;
    }

    private getDisplayableNotificationsRequest(
        params: NotificationsPaginationParams,
    ): PaginatedRequest<DisplayableNotification> {
        return new PaginatedRequest<DisplayableNotification>(
            Object.assign(params, {
                http: this.http,
                url: `${this.env.server}/notifications`,
                factory: (res: NotificationResponse) => {
                    this.notificationsCount = res.notificationsCount;
                    this.unreadNotificationsCount =
                        res.unreadNotificationsCount;
                    return notificationsBuilder.buildArray(res.notifications);
                },
                queryParameters: {},
            }),
        );
    }

    private get notificationsCount(): number {
        return this._notificationsCount;
    }

    private set notificationsCount(value: number) {
        this._notificationsCount = value;
    }

    private set unreadNotificationsCount(value: number) {
        this._unreadNotificationsCount = value;
        this.unreadNotificationsSubject.next();
    }
}
