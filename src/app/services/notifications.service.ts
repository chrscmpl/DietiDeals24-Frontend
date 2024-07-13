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

type NotificationsPaginationParams = Omit<
    PaginatedRequestParams<DisplayableNotification>,
    'http' | 'factory' | 'url' | 'queryParameters'
>;

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private request: PaginatedRequest<DisplayableNotification> | null = null;
    public readonly notifications: DisplayableNotification[] = [];

    constructor(
        private readonly http: HttpClient,
        private readonly env: EnvironmentService,
        private readonly authentication: AuthenticationService,
    ) {
        this.authentication.isLogged$.subscribe((logged) => {
            if (logged) {
                this.request = this.getDisplayableNotificationsRequest({
                    pageSize: 3,
                    pageNumber: 1,
                    eager: false,
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

    private TEMP_ID = 1; // remove

    public more(): void {
        if (this.request === null) return;

        // this.request.more();
        console.log('more');
        for (let i = 0; i < 3; i++) {
            this.notifications.push({
                id: `${this.TEMP_ID++}`,
                heading: 'Test header!!!',
                message: 'Test message!!!',
                link: '',
                read: this.TEMP_ID !== 2,
            });
        }
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
