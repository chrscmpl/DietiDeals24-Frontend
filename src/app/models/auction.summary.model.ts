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

    constructor(dto: AuctionSummaryDTO) {
        this._id = dto.id;
        this._title = dto.title;
        this._conditions = dto.conditions ?? null;
        this._location = { country: dto.country, city: dto.city };
        this._endTime = new Date(dto.endTime);
        this._pictureUrl = dto.pictureUrl ?? null;
        this._status = dto.status;
        this._currency = dto.currency;
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

    public abstract bidValid(bid: number): boolean;
}

export class SilentAuctionSummary extends AuctionSummary {
    private _minimumBid: number;
    constructor(dto: SilentAuctionSummaryDTO) {
        super(dto);
        this._minimumBid = dto.minimumBid;
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

    public override bidValid(bid: number): boolean {
        return bid > this._minimumBid;
    }
}

export class ReverseAuctionSummary extends AuctionSummary {
    private _maximumStartingBid: number;
    private _lowestBid: number;

    constructor(dto: ReverseAuctionSummaryDTO) {
        super(dto);
        this._maximumStartingBid = dto.maximumBid;
        this._lowestBid = dto.lowestBidSoFar ?? dto.maximumBid;
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

    public override bidValid(bid: number): boolean {
        return bid < this._lowestBid;
    }
}
