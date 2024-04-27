import { Location } from './location.model';
import { Money } from './money.model';
import { UserSummary } from './user.model';

export enum AuctionType {
  silent = 'silent auction',
  reverse = 'reverse auction',
}

enum auctionStatus {
  active,
  pending,
  accepted,
  rejected,
}

interface AuctionInterface {
  id: string;
  title: string;
  description?: string;
  user?: UserSummary;
  conditions: string;
  location: Location;
  timeLeft: number;
  endTime: number;
  endDate: Date;
  images: string[];
  lastBid: Money;
  lastBidDescription: string;
  auctionType: AuctionType;
  status: auctionStatus;
}

type AuctionParameters = Omit<
  AuctionInterface,
  | 'lastBid'
  | 'lastBidDescription'
  | 'auctionType'
  | 'endDate'
  | 'images'
  | 'timeLeft'
> &
  Partial<Pick<AuctionInterface, 'images'>>;

export abstract class Auction implements AuctionInterface {
  public static STATUSES = auctionStatus;
  public static TYPES = AuctionType;
  private _id: string;
  private _title: string;
  private _description?: string;
  private _user?: UserSummary;
  private _conditions: string;
  private _location: Location;
  private _endTime: number;
  private _images: string[];
  private _status: auctionStatus;

  constructor(auction: AuctionParameters) {
    this._id = auction.id;
    this._title = auction.title;
    this._description = auction.description;
    this._user = auction.user;
    this._conditions = auction.conditions;
    this._location = auction.location;
    this._endTime = auction.endTime;
    this._images = auction.images ?? [];
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

  public get conditions(): string {
    return this._conditions;
  }

  public get location(): Location {
    return this._location;
  }

  public get timeLeft(): number {
    return this._endTime - Math.floor(Date.now() / 1000);
  }

  public get endTime(): number {
    return this._endTime;
  }

  public get endDate(): Date {
    const date = new Date();
    date.setSeconds(this._endTime);
    return date;
  }

  public get images(): string[] {
    return this._images;
  }

  public get status(): auctionStatus {
    return this._status;
  }

  public abstract get lastBid(): Money;

  public abstract get lastBidDescription(): string;

  public abstract get auctionType(): AuctionType;

  private missingFields(): string[] {
    const missing = [];
    if (this._description === undefined) missing.push('description');
    if (this._user === undefined) missing.push('user');
    return missing;
  }

  public abstract complete(): void;
}

export class SilentAuction extends Auction {
  private _minimumBid: Money;
  constructor(
    auction: AuctionParameters & {
      minimumBid: Money;
    }
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

  public override get auctionType(): AuctionType {
    return AuctionType.silent;
  }

  public override complete(): void {}
}

export class ReverseAuction extends Auction {
  private _maximumStartingBid: Money;
  private _lowestBid: Money;

  constructor(
    auction: AuctionParameters & {
      maximumStartingBid: Money;
      lowestBid: Money;
    }
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

  public override get auctionType(): AuctionType {
    return AuctionType.reverse;
  }

  public override complete(): void {}
}
