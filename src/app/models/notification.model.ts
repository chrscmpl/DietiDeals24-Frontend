import { NotificationDTO } from '../DTOs/notification.dto';
import { auctionBuilder } from '../helpers/auctionBuilder';
import { routerLinkType } from '../typeUtils/routerLinkType';
import { AuctionSummary } from './auction.model';
import { Bid } from './bid.model';

export interface DisplayableNotification {
    readonly id: string;
    readonly heading: string;
    readonly message: string;
    readonly link: routerLinkType;
    read: boolean;
}

export enum NotificationType {
    AUCTION_OVER = 'AuctionOver',
    NEW_BID = 'NewBid',
    OUT_BID = 'Outbid',
    WINNING_BID = 'WinningBid',
    BID_REJECTED = 'BidRejected',
}

export class Notification implements DisplayableNotification {
    private _id: string;
    private _type: NotificationType;
    private _read: boolean;

    private _username: string | null;
    private _auction: AuctionSummary | null;
    private _bid: Bid | null;

    constructor(dto: NotificationDTO) {
        this._id = dto.id;
        this._type = dto.notificationType;
        this._read = dto.read;
        this._username = dto.username ?? null;
        this._auction = dto.auction
            ? auctionBuilder.buildSingle(dto.auction)
            : null;
        this._bid = dto.bid ?? null;
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

    public get username(): string | null {
        return this._username;
    }

    public get auction(): AuctionSummary | null {
        return this._auction;
    }

    public get bid(): Bid | null {
        return this._bid;
    }

    public get heading(): string {
        return '';
    }

    public get message(): string {
        return '';
    }

    public get link(): routerLinkType {
        return null;
    }
}

export class AuctionOverNotification extends Notification {
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

export class NewBidNotification extends Notification {
    public constructor(dto: NotificationDTO) {
        super(dto);
    }

    public override get heading(): string {
        return this.auction?.title ?? 'A new bid';
    }

    public override get message(): string {
        return `${this.username} has placed a ${this.bid?.amount} ${this.bid?.currency} bid on your auction`;
    }

    public override get link(): routerLinkType {
        return ['/auction', this.auction?.id];
    }
}
