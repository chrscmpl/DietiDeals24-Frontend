import { NotificationDTO } from '../DTOs/notification.dto';
import { auctionBuilder } from '../helpers/builders/auction-builder';
import { routerLinkType } from '../typeUtils/routerLinkType';
import { Auction } from './auction.model';

export interface DisplayableNotification {
    readonly id: string;
    readonly heading: string;
    readonly message: string;
    readonly link: routerLinkType;
    read: boolean;
}

export enum NotificationType {
    AUCTION_OVER = 'auction-over',
    AUCTION_EXPIRED = 'auction-expired',
    AUCTION_ABORTED = 'auction-aborted',
    NEW_BID = 'new-bid',
    OUT_BID = 'out-bid',
    WINNING_BID = 'winning-bid',
    BID_REJECTED = 'bid-rejected',
}

export class Notification implements DisplayableNotification {
    private _id: string;
    private _type: NotificationType;
    private _read: boolean;

    private _auction: Auction | null;

    constructor(dto: NotificationDTO) {
        this._id = dto.id;
        this._type = dto.notificationType;
        this._read = dto.read;
        this._auction = dto.auction
            ? auctionBuilder.buildSingle(dto.auction)
            : null;
    }

    public get id(): string {
        return this._id;
    }

    public get type(): NotificationType {
        return this._type;
    }

    public get read(): boolean {
        return this._read;
    }

    public set read(value: boolean) {
        this._read = value;
    }

    public get auction(): Auction | null {
        return this._auction;
    }

    public get heading(): string {
        return '';
    }

    public get message(): string {
        return '';
    }

    public get link(): routerLinkType {
        return [];
    }
}

class AuctionOverNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'An auction ended';
    }

    public override get message(): string {
        return 'Your auction awaits a conclusion';
    }

    public override get link(): routerLinkType {
        return ['/auction/conclusion', this.auction?.id];
    }
}

class AuctionExpiredNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'An auction expired';
    }

    public override get message(): string {
        return 'The winning bid was automatically rejected';
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

class AuctionAbortedNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'An auction was deleted';
    }

    public override get message(): string {
        return 'The auction was deleted by its creator';
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

class NewBidNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'A new bid';
    }

    public override get message(): string {
        return `You have new bids for your auction`;
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

class OutBidNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'Outbid';
    }

    public override get message(): string {
        return `You have been outbid`;
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

class WinningBidNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'Winning bid';
    }

    public override get message(): string {
        return `Your bid of CURRENCY{${this.auction?.lastBid}|${this.auction?.currency}} won`;
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

class BidRejectedNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'Bid rejected';
    }

    public override get message(): string {
        return `Your bid of CURRENCY{${this.auction?.lastBid}|${this.auction?.currency}} has been rejected`;
    }

    public override get link(): routerLinkType {
        return [{ outlets: { overlay: ['auctions', this.auction?.id] } }];
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NotificationConstructors = new Map<NotificationType, any>([
    [NotificationType.AUCTION_OVER, AuctionOverNotification],
    [NotificationType.AUCTION_EXPIRED, AuctionExpiredNotification],
    [NotificationType.AUCTION_ABORTED, AuctionAbortedNotification],
    [NotificationType.NEW_BID, NewBidNotification],
    [NotificationType.OUT_BID, OutBidNotification],
    [NotificationType.WINNING_BID, WinningBidNotification],
    [NotificationType.BID_REJECTED, BidRejectedNotification],
]);
