import { Injectable } from '@angular/core';
import { DisplayableNotification } from '../models/notification.model';
import { NotificationResponse } from '../DTOs/notification.dto';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { filter, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { notificationsBuilder } from '../helpers/builders/notificationBuilder';
import { environment } from '../../environments/environment';
import { PaginatedRequestManager } from '../helpers/paginatedRequestManager';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private static readonly PAGE_SIZE = 9;
    private request: PaginatedRequestManager<DisplayableNotification>;

    private _lockRefreshCounter: number = 0;

    private _notificationsCount: number = 0;
    private _unreadNotificationsCount: number = 0;

    public get notifications(): ReadonlyArray<DisplayableNotification> {
        return this.request.elements;
    }

    private unreadNotificationsSubject: ReplaySubject<void> =
        new ReplaySubject<void>(1);
    public unreadNotificationsCount$: Observable<number> =
        this.unreadNotificationsSubject
            .asObservable()
            .pipe(map(() => this._unreadNotificationsCount));

    private loadingEndedSubject: Subject<void> = new Subject<void>();
    public loadingEnded$: Observable<void> =
        this.loadingEndedSubject.asObservable();

    constructor(
        private readonly http: HttpClient,
        private readonly authentication: AuthenticationService,
    ) {
        this.request = new PaginatedRequestManager({
            http: this.http,
            url: `${environment.backendHost}/notifications/all`,
            factory: (res: NotificationResponse): DisplayableNotification[] => {
                this.notificationsCount = res.notificationsCounter;
                this.unreadNotificationsCount = res.unreadNotifications;
                return notificationsBuilder.buildArray(
                    res.notifications.filter(
                        (dto) =>
                            this.notifications.find((n) => n.id === dto.id) ===
                            undefined,
                    ),
                );
            },
            queryParameters: {},
            pageNumber: 1,
            pageSize: NotificationsService.PAGE_SIZE,
            eager: false,
        });

        const endLoading = this.loadingEndedSubject.next.bind(
            this.loadingEndedSubject,
        );

        this.request.subscribeUninterrupted({
            next: endLoading,
            error: endLoading,
            complete: endLoading,
            reset: endLoading,
        });

        this.authentication.isLogged$
            .pipe(filter((isLogged) => isLogged))
            .subscribe(() => {
                this.unreadNotificationsCount =
                    this.authentication.loggedUser
                        ?.unreadNotificationsCounter ?? 0;
                this.refresh();
            });
    }

    public refresh(): void {
        if (this._lockRefreshCounter > 0) return;
        this.request.reset();
        this.more();
    }

    public more(): void {
        if (this.request.isComplete) {
            this.loadingEndedSubject.next();
            return;
        }

        this.request.more();
    }

    public markAsRead(notification: DisplayableNotification): void {
        if (notification.read) return;
        notification.read = true;
        this.unreadNotificationsCount--;
        this.http
            .post(
                `${environment.backendHost}/notifications/mark-as-read?notificationId=${notification.id}`,
                {},
            )
            .subscribe();
    }

    public markAllAsRead(): void {
        this.notifications.forEach(
            (notification) => (notification.read = true),
        );
        this.unreadNotificationsCount = 0;
        this.http
            .post(`${environment.backendHost}/notifications/read`, {})
            .subscribe();
    }

    public deleteOne(notification: DisplayableNotification): void {
        const index = this.notifications.findIndex(
            (n) => n.id === notification.id,
        );
        if (index === -1) return;
        if (!notification.read) this.unreadNotificationsCount--;
        this.request.editableElements.splice(index, 1);
        this.http
            .delete(
                `${environment.backendHost}/notifications/mark-as-eliminated?notificationId=${notification.id}`,
            )
            .subscribe();
    }

    public deleteAll(): void {
        this.request.editableElements.splice(0, this.notifications.length);
        this.unreadNotificationsCount = 0;
        this.http
            .delete(`${environment.backendHost}/notifications`)
            .subscribe();
    }

    public get unreadNotificationsCount(): number {
        return this._unreadNotificationsCount;
    }

    public get isComplete(): boolean {
        return this.request?.isComplete ?? true;
    }

    public lockRefresh(value: boolean): void {
        if (value) this._lockRefreshCounter++;
        else this._lockRefreshCounter--;
    }

    private get notificationsCount(): number {
        return this._notificationsCount;
    }

    private set notificationsCount(value: number) {
        this._notificationsCount = value;
    }

    private set unreadNotificationsCount(value: number) {
        this._unreadNotificationsCount = value >= 0 ? value : 0;
        this.unreadNotificationsSubject.next();
    }
}
