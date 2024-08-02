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
    protected _id: string;
    protected _title: string;
    protected _conditions: string | null;
    protected _location: Location;
    protected _endTime: Date;
    protected _status: AuctionStatus;
    protected _currency: string;

    protected _winningBid: number | null;
    protected _winnerId: string | null;

    protected _category: string | null;
    protected _description: string | null;
    protected _bids: number | null;
    protected _userId: string | null;
    protected _picturesUrls: string[];

    constructor(dto: AuctionDTO) {
        this._id = dto.id;
        this._title = dto.title;
        this._conditions = dto.conditions ?? null;
        this._location = { country: dto.country, city: dto.city };
        this._endTime = new Date(dto.endTime);
        this._status = dto.status;
        this._currency = dto.currency;

        this._winningBid = dto.winningBid ?? null;
        this._winnerId = dto.winnerId ?? null;

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

    public get winningBid(): number | null {
        return this._winningBid;
    }

    public get winnerId(): string | null {
        return this._winnerId;
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

    public abstract nextValidBid(): number;

    public abstract bidValid(bid: number): boolean;

    public abstract newBidCategory(): 'selling' | 'buying';

    public abstract newBidDescription(): string;

    public abstract invalidBidError(): string;
}

export class SilentAuction extends Auction {
    protected _minimumBid: number;
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

    public override nextValidBid(): number {
        return this._minimumBid;
    }

    public override bidValid(bid: number): boolean {
        return bid >= this._minimumBid;
    }

    public override newBidCategory(): 'buying' {
        return 'buying';
    }

    public override newBidDescription(): string {
        return `at least CURRENCY{${this._minimumBid}|${this.currency}}`;
    }

    public override invalidBidError(): string {
        return `Bid must be equal or higher than CURRENCY{${this._minimumBid}|${this.currency}}`;
    }
}

export class ReverseAuction extends Auction {
    protected static MINIMUM_BID_DIFFERENCE = 1;

    protected _maximumStartingBid: number;
    protected _lowestBid: number;

    constructor(dto: ReverseAuctionDTO) {
        super(dto);
        this._maximumStartingBid = dto.maximumBid;
        this._lowestBid = dto.lowestBidSoFar ?? dto.maximumBid;
        if (this._winningBid === null && this.status !== AuctionStatus.active)
            this._winningBid = this._lowestBid;
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

    public override nextValidBid(): number {
        return this._lowestBid - ReverseAuction.MINIMUM_BID_DIFFERENCE > 0
            ? this._lowestBid - ReverseAuction.MINIMUM_BID_DIFFERENCE
            : this._lowestBid - 0.01;
    }

    public override bidValid(bid: number): boolean {
        return bid <= this.nextValidBid();
    }

    public override newBidCategory(): 'selling' {
        return 'selling';
    }

    public override newBidDescription(): string {
        return `no more than CURRENCY{${this.nextValidBid()}|${this.currency}}`;
    }

    public override invalidBidError(): string {
        return `Bid must not be higher than CURRENCY{${this.nextValidBid()}|${this.currency}}`;
    }
}
