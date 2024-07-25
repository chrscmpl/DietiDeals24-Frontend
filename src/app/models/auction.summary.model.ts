import {
    AuctionSummaryDTO,
    ReverseAuctionSummaryDTO,
    SilentAuctionSummaryDTO,
} from '../DTOs/auction.dto';
import { AuctionType, AuctionStatus } from '../typeUtils/auction.utils';
import { Location } from './location.model';

export abstract class AuctionSummary {
    public static STATUSES = AuctionStatus;
    public static TYPES = AuctionType;
    private _id: string;
    private _title: string;
    private _conditions: string | null;
    private _location: Location;
    private _endTime: Date;
    private _pictureUrl: string | null;
    private _status: AuctionStatus;
    private _currency: string;

    constructor(auction: AuctionSummaryDTO) {
        this._id = auction.id;
        this._title = auction.title;
        this._conditions = auction.conditions ?? null;
        this._location = { country: auction.country, city: auction.city };
        this._endTime = new Date(auction.endTime);
        this._pictureUrl = auction.pictureUrl ?? null;
        this._status = auction.status;
        this._currency = auction.currency;
    }

    public get id(): string {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public get conditions(): string | null {
        return this._conditions;
    }

    public get location(): Location {
        return this._location;
    }

    public get timeLeft(): number {
        return Math.floor((this._endTime.getTime() - Date.now()) / 1000);
    }

    public get endTime(): Date {
        return this._endTime;
    }

    public get pictureUrl(): string | null {
        return this._pictureUrl;
    }

    public get status(): AuctionStatus {
        return this._status;
    }

    public get currency(): string {
        return this._currency;
    }

    public abstract get lastBid(): number;

    public abstract get lastBidDescription(): string;

    public abstract get type(): AuctionType;
}

export class SilentAuctionSummary extends AuctionSummary {
    private _minimumBid: number;
    constructor(auction: SilentAuctionSummaryDTO) {
        super(auction);
        this._minimumBid = auction.minimumBid;
    }

    public get minimumBid(): number {
        return this._minimumBid;
    }

    public override get lastBid(): number {
        return this._minimumBid;
    }

    public override get lastBidDescription(): string {
        return 'minimum bid';
    }

    public override get type(): AuctionType {
        return AuctionType.silent;
    }
}

export class ReverseAuctionSummary extends AuctionSummary {
    private _maximumStartingBid: number;
    private _lowestBid: number;

    constructor(auction: ReverseAuctionSummaryDTO) {
        super(auction);
        this._maximumStartingBid = auction.maximumStartingBid;
        this._lowestBid = auction.lowestBid;
    }

    public get maximumStartingBid(): number {
        return this._maximumStartingBid;
    }

    public get lowestBid(): number {
        return this._lowestBid;
    }

    public override get lastBid(): number {
        return this._lowestBid;
    }

    public override get lastBidDescription(): string {
        return this._lowestBid === this._maximumStartingBid
            ? 'maximum starting bid'
            : 'lowest bid';
    }

    public override get type(): AuctionType {
        return AuctionType.reverse;
    }
}
