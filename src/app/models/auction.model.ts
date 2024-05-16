import { Location } from './location.model';
import { Money } from './money.model';
import { UserSummary } from './user.model';

export enum AuctionType {
    silent = 'silent',
    reverse = 'reverse',
}

enum auctionStatus {
    active,
    pending,
    accepted,
    rejected,
}

interface AuctionSummaryInterface {
    id: string;
    title: string;
    conditions: string | null;
    location: Location;
    endTime: Date;
    pictureUrl: string | null;
    status: auctionStatus;

    type: AuctionType;
    timeLeft: number;
    lastBid: Money;
    lastBidDescription: string;
}

export type AuctionSummaryDTO = Omit<
    AuctionSummaryInterface,
    | 'conditions'
    | 'lastBid'
    | 'lastBidDescription'
    | 'endTime'
    | 'pictureUrl'
    | 'timeLeft'
    | 'location'
> &
    Partial<Pick<AuctionSummaryInterface, 'pictureUrl' | 'conditions'>> &
    Location & { endTime: string };

export type AuctionSearchParameters = Partial<{
    keywords: string;
    type: string;
    category: string;
    macroCategory: string;
}>;

export abstract class AuctionSummary implements AuctionSummaryInterface {
    public static STATUSES = auctionStatus;
    public static TYPES = AuctionType;
    private _id: string;
    private _title: string;
    private _description?: string;
    private _user?: UserSummary;
    private _conditions: string | null;
    private _location: Location;
    private _endTime: Date;
    private _pictureUrl: string | null;
    private _status: auctionStatus;

    constructor(auction: Omit<AuctionSummaryDTO, 'auctionType'>) {
        this._id = auction.id;
        this._title = auction.title;
        this._conditions = auction.conditions ?? null;
        this._location = { country: auction.country, city: auction.city };
        this._endTime = new Date(auction.endTime);
        this._pictureUrl = auction.pictureUrl ?? null;
        this._status = auction.status;
    }

    public get id(): string {
        return this._id;
    }

    public get title(): string {
        return this._title;
    }

    public get description(): string | undefined {
        return this._description;
    }

    private set description(value: string) {
        this._description = value;
    }

    public get user(): UserSummary | undefined {
        return this._user;
    }

    private set user(value: UserSummary) {
        this._user = value;
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

    public get status(): auctionStatus {
        return this._status;
    }

    public abstract get lastBid(): Money;

    public abstract get lastBidDescription(): string;

    public abstract get type(): AuctionType;
}

export class SilentAuctionSummary extends AuctionSummary {
    private _minimumBid: Money;
    constructor(
        auction: Omit<AuctionSummaryDTO, 'auctionType'> & {
            minimumBid: Money;
        },
    ) {
        super(auction);
        this._minimumBid = auction.minimumBid;
    }

    public get minimumBid(): Money {
        return this._minimumBid;
    }

    public override get lastBid(): Money {
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
    private _maximumStartingBid: Money;
    private _lowestBid: Money;

    constructor(
        auction: Omit<AuctionSummaryDTO, 'auctionType'> & {
            maximumStartingBid: Money;
            lowestBid: Money;
        },
    ) {
        super(auction);
        this._maximumStartingBid = auction.maximumStartingBid;
        this._lowestBid = auction.lowestBid;
    }

    public get maximumStartingBid(): Money {
        return this._maximumStartingBid;
    }

    public get lowestBid(): Money {
        return this._lowestBid;
    }

    public override get lastBid(): Money {
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
