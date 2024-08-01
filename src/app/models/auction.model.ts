import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../DTOs/auction.dto';
import { AuctionType, AuctionStatus } from '../typeUtils/auction.utils';
import { Location } from './location.model';

export abstract class Auction {
    public static STATUSES = AuctionStatus;
    public static TYPES = AuctionType;
    private _id: string;
    private _title: string;
    private _conditions: string | null;
    private _location: Location;
    private _endTime: Date;
    private _status: AuctionStatus;
    private _currency: string;

    private _category: string | null;
    private _description: string | null;
    private _bids: number | null;
    private _userId: string | null;
    private _picturesUrls: string[];

    constructor(dto: AuctionDTO) {
        this._id = dto.id;
        this._title = dto.title;
        this._conditions = dto.conditions ?? null;
        this._location = { country: dto.country, city: dto.city };
        this._endTime = new Date(dto.endTime);
        this._status = dto.status;
        this._currency = dto.currency;

        this._category = dto.category ?? null;
        this._description = dto.description ?? null;
        this._bids = dto.numberOfBids ?? null;
        this._userId = dto.userId ?? null;
        this._picturesUrls =
            dto.picturesUrls ?? (dto.pictureUrl ? [dto.pictureUrl] : []);
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

    public get status(): AuctionStatus {
        return this._status;
    }

    public get currency(): string {
        return this._currency;
    }

    public get category(): string | null {
        return this._category;
    }

    public get description(): string | null {
        return this._description;
    }

    public get bids(): number | null {
        return this._bids;
    }

    public get userId(): string | null {
        return this._userId;
    }

    public get picturesUrls(): string[] {
        return this._picturesUrls;
    }

    public get pictureUrl(): string | null {
        return this._picturesUrls[0] ?? null;
    }

    public abstract get lastBid(): number;

    public abstract get lastBidDescription(): string;

    public abstract get type(): AuctionType;

    public abstract bidValid(bid: number): boolean;

    public abstract newBidCategory(): 'selling' | 'buying';

    public abstract newBidDescription(): string;

    public abstract invalidBidError(): string;
}

export class SilentAuction extends Auction {
    private _minimumBid: number;
    constructor(dto: SilentAuctionDTO) {
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

    public override newBidCategory(): 'buying' {
        return 'buying';
    }

    public override newBidDescription(): string {
        return `more than CURRENCY{${this._minimumBid}|${this.currency}}`;
    }

    public override invalidBidError(): string {
        return `Bid must be higher than CURRENCY{${this._minimumBid}|${this.currency}}`;
    }
}

export class ReverseAuction extends Auction {
    private _maximumStartingBid: number;
    private _lowestBid: number;

    constructor(dto: ReverseAuctionDTO) {
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

    public override newBidCategory(): 'selling' {
        return 'selling';
    }

    public override newBidDescription(): string {
        return `less than CURRENCY{${this._lowestBid}|${this.currency}}`;
    }

    public override invalidBidError(): string {
        return `Bid must be lower than CURRENCY{${this._lowestBid}|${this.currency}}`;
    }
}
