import { NotificationDTO } from '../../DTOs/notification.dto';
import {
    Notification,
    NotificationConstructors,
    NotificationType,
} from '../../models/notification.model';
import { Builder } from './Builder';

export const notificationsBuilder = new Builder<Notification>(
    (type: string) => {
        const constructor = NotificationConstructors.get(
            type as NotificationType,
        );
        if (!constructor) throw new Error('Invalid notification DTO');
        return (item: NotificationDTO) => new constructor(item);
    },
    'notificationType',
);
