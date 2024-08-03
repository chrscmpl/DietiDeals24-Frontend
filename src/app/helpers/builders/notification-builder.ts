import { NotificationDTO } from '../../DTOs/notification.dto';
import {
    Notification,
    NotificationConstructors,
    NotificationType,
} from '../../models/notification.model';
import { Builder } from './builder';

export const notificationsBuilder = new Builder<NotificationDTO, Notification>(
    (dto) => {
        const constructor = NotificationConstructors.get(
            dto.notificationType as NotificationType,
        );
        if (!constructor) throw new Error('Invalid notification DTO');
        return new constructor(dto);
    },
);
