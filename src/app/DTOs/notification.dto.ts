import { NotificationType } from '../models/notification.model';
import { AuctionSummaryDTO } from './auction.dto';

export interface NotificationResponse {
    notifications: NotificationDTO[];
    notificationsCount: number;
    unreadNotificationsCount: number;
}

export interface NotificationDTO {
    id: string;
    notificationType: NotificationType;
    read: boolean;

    auction?: AuctionSummaryDTO | null;
}
