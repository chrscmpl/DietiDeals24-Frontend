import { NotificationType } from '../models/notification.model';
import { AuctionSummaryDTO } from './auction.dto';
import { BidDTO } from './bid.dto';

export interface NotificationDTO {
    id: string;
    notificationType: NotificationType;
    read: boolean;

    username?: string;
    auction?: AuctionSummaryDTO | null;
    bid: BidDTO | null;
}
