import { NotificationType } from '../models/notification.model';
import { AuctionDTO } from './auction.dto';

export interface NotificationResponse {
    notifications: NotificationDTO[];
    notificationsCounter: number;
    unreadNotifications: number;
}

export interface NotificationDTO {
    id: string;
    notificationType: NotificationType;
    read: boolean;

    auction?: AuctionDTO | null;
}
