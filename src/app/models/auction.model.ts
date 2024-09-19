import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../DTOs/auction.dto';
import { AuctionKind } from '../enums/auction-kind.enum';
import { AuctionStatus } from '../enums/auction-status.enum';
import { AuctionRuleSet } from '../enums/auction-ruleset.enum';
import { UserSummary } from './user.model';

type bidValidationError = { min: true } | { max: true };

export abstract class Auction {
    public static STATUSES = AuctionStatus;
    public static TYPES = AuctionRuleSet;
    protected _id: string;
    protected _title: string;
    protected _conditions: string | null;
    protected _country: string;
    protected _city: string;
    protected _endTime: Date;
    protected _status: AuctionStatus;
    protected _currency: string;

    protected _category: string | null;
    protected _description: string | null;
    protected _bids: number | null;
    protected _userId: string | null;
    protected _lastBidderId: string | null;
    protected _picturesUrls: string[];

    protected _ownBid: number | null = null;

    protected _user: UserSummary | null = null;
    protected _lastBidder: UserSummary | null = null;

    protected _isOver: boolean;

    constructor(dto: AuctionDTO) {
        this._id = String(dto.id);
        this._title = dto.title;
        this._conditions = dto.conditions ?? null;
        this._country = dto.country;
        this._city = dto.city;
        this._endTime = new Date(dto.endTime);
        this._status = dto.status;
        this._currency = dto.currency;
        this._category = dto.category ?? null;
        this._description = dto.description ?? null;
        this._bids = dto.numberOfBids ?? null;
        this._userId = String(dto.userId) ?? null;
        this._lastBidderId = String(dto.currentBidderId) ?? null;
        this._picturesUrls =
            dto.picturesUrls ?? (dto.pictureUrl ? [dto.pictureUrl] : []);
        this._ownBid =
            dto.ownBid ??
            (dto.ownBids?.length
                ? dto.ownBids?.[dto.ownBids?.length - 1]?.bidAmount
                : null) ??
            null;
        this._isOver = this._status !== Auction.STATUSES.active;
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

    public get country(): string {
        return this._country;
    }

    public get city(): string {
        return this._city;
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

    public get lastBidderId(): string | null {
        return this._lastBidderId;
    }

    public get picturesUrls(): string[] {
        return this._picturesUrls;
    }

    public get pictureUrl(): string | null {
        return this._picturesUrls[0] ?? null;
    }

    public get ownBid(): number | null {
        return this._ownBid;
    }

    public get user(): UserSummary | null {
        return this._user;
    }

    public set user(user: UserSummary) {
        this._user = user;
    }

    public get lastBidder(): UserSummary | null {
        return this._lastBidder;
    }

    public set lastBidder(winner: UserSummary) {
        this._lastBidder = winner;
    }

    public get winner(): UserSummary | null {
        return this._lastBidder;
    }

    public set winner(winner: UserSummary) {
        this._lastBidder = winner;
    }

    public get ownerUsername(): string | null {
        return this._user?.username ?? null;
    }

    public get winnerUsername(): string | null {
        return this._lastBidder?.username ?? null;
    }

    public get isOver(): boolean {
        return this._isOver;
    }

    public abstract get winningBid(): number | null;

    public abstract get winnerId(): string | null;

    public abstract get lastBid(): number;

    public abstract get lastBidDescription(): string;

    public abstract get ruleset(): AuctionRuleSet;

    public abstract get kind(): AuctionKind;

    public abstract canBeBiddenOn(): boolean;

    public abstract validateBid(bid: number): bidValidationError | null;

    public abstract newBidDescription(): string;

    public abstract getErrorMessage(error: 'min' | 'max'): string;
}

export class SilentAuction extends Auction {
    protected _minimumBid: number;
    protected _highestBid: number | null = null;
    constructor(dto: SilentAuctionDTO) {
        super(dto);
        this._minimumBid = dto.minimumBid ?? dto.startingBid ?? dto.lastBid;
        this._highestBid = dto.highestBidSoFar ?? null;
    }

    public get minimumBid(): number {
        return this._minimumBid;
    }

    public override get lastBid(): number {
        return this._highestBid ?? this._minimumBid;
    }

    public override get winningBid(): number | null {
        if (!this._isOver) return null;
        return this._highestBid;
    }

    public override get winnerId(): string | null {
        if (!this._isOver) return null;
        return this._lastBidderId;
    }

    public override get lastBidDescription(): string {
        return this._highestBid ? 'highest bid' : 'minimum bid';
    }

    public override get ruleset(): AuctionRuleSet {
        return AuctionRuleSet.silent;
    }

    public override get kind(): AuctionKind {
        return AuctionKind.selling;
    }

    public override canBeBiddenOn(): boolean {
        return !this._ownBid;
    }

    public override validateBid(bid: number): bidValidationError | null {
        return bid < this._minimumBid ? { min: true } : null;
    }

    public override newBidDescription(): string {
        return `at least CURRENCY{${this._minimumBid}|${this.currency}}`;
    }

    public override getErrorMessage(error: 'min' | 'max'): string {
        return error === 'min'
            ? `Bid must be at least CURRENCY{${this._minimumBid}|${this.currency}}`
            : '';
    }
}

export class ReverseAuction extends Auction {
    protected static MINIMUM_BID_DIFFERENCE = 1;

    protected _maximumStartingBid: number;
    protected _lowestBid: number;

    constructor(dto: ReverseAuctionDTO) {
        super(dto);
        this._maximumStartingBid =
            dto.maximumBid ?? dto.startingBid ?? dto.lastBid;
        this._lowestBid = dto.lowestBidSoFar ?? this._maximumStartingBid;
        if (this._ownBid !== this._lowestBid) this._ownBid = null;
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

    public override get winningBid(): number | null {
        if (!this._isOver) return null;
        return this._lowestBid;
    }

    public override get winnerId(): string | null {
        if (!this._isOver) return null;
        return this._lastBidderId;
    }

    public override get lastBidDescription(): string {
        return this._lowestBid === this._maximumStartingBid
            ? 'maximum starting bid'
            : 'lowest bid';
    }

    public override get ruleset(): AuctionRuleSet {
        return AuctionRuleSet.reverse;
    }

    public override get kind(): AuctionKind {
        return AuctionKind.buying;
    }

    public override canBeBiddenOn(): boolean {
        return !this._ownBid || this._ownBid > this._lowestBid;
    }

    private nextValidBid(): number {
        return this._lowestBid - ReverseAuction.MINIMUM_BID_DIFFERENCE > 0
            ? this._lowestBid - ReverseAuction.MINIMUM_BID_DIFFERENCE
            : this._lowestBid - 0.01;
    }

    public override validateBid(bid: number): bidValidationError | null {
        return bid > this.nextValidBid()
            ? { max: true }
            : bid < 0
              ? { min: true }
              : null;
    }

    public override newBidDescription(): string {
        return `no more than CURRENCY{${this.nextValidBid()}|${this.currency}}`;
    }

    public override getErrorMessage(error: 'min' | 'max'): string {
        return error === 'max'
            ? `Bid must not be higher than CURRENCY{${this.nextValidBid()}|${this.currency}}`
            : 'Bid must not be negative';
    }
}
