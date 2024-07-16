import { NotificationDTO } from '../DTOs/notification.dto';
import {
    Notification,
    NotificationConstructors,
} from '../models/notification.model';

class NotificationsBuilder {
    private build = (notification: NotificationDTO): Notification => {
        const constructor = NotificationConstructors.get(
            notification.notificationType,
        );
        if (!constructor) throw new Error('Invalid notification DTO');
        else return new constructor(notification);
    };

    public buildSingle(notification: NotificationDTO): Notification {
        return this.build(notification);
    }

    public buildArray(notifications: NotificationDTO[]): Notification[] {
        return notifications.map((notification) => this.build(notification));
    }
}

export const notificationsBuilder = new NotificationsBuilder();
