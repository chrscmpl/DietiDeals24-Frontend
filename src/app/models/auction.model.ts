import { Location } from './location.model';
import { userSummary } from './user.model';

export enum AuctionType {
  silent = 'silent auction',
  reverse = 'reverse auction',
}

interface AuctionInterface {
  id: string;
  title: string;
  description?: string;
  user?: userSummary;
  conditions: string;
  location: Location;
  timeLeft: number;
  endTime: number;
  endDate: Date;
  images: string[];
  sum: number;
  sumDescription: string;
  auctionType: AuctionType;
}

type AuctionParameters = Omit<
  AuctionInterface,
  'sum' | 'sumDescription' | 'auctionType' | 'endDate' | 'images' | 'timeLeft'
> &
  Partial<Pick<AuctionInterface, 'images'>>;

export abstract class Auction implements AuctionInterface {
  private _id: string;
  private _title: string;
  private _description?: string;
  private _user?: userSummary;
  private _conditions: string;
  private _location: Location;
  private _endTime: number;
  private _images: string[];

  constructor(auction: AuctionParameters) {
    this._id = auction.id;
    this._title = auction.title;
    this._description = auction.description;
    this._user = auction.user;
    this._conditions = auction.conditions;
    this._location = auction.location;
    this._endTime = auction.endTime;
    this._images = auction.images ?? [];
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

  public get user(): userSummary | undefined {
    return this._user;
  }

  private set user(value: userSummary) {
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

  public abstract get sum(): number;

  public abstract get sumDescription(): string;

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
  private _minimumBid: number;
  constructor(
    auction: AuctionParameters & {
      minimumBid: number;
    }
  ) {
    super(auction);
    this._minimumBid = auction.minimumBid;
  }

  public get minimumBid(): number {
    return this._minimumBid;
  }

  public override get sum(): number {
    return this._minimumBid;
  }

  public override get sumDescription(): string {
    return 'minimum bid';
  }

  public override get auctionType(): AuctionType {
    return AuctionType.silent;
  }

  public override complete(): void {}
}

export class ReverseAuction extends Auction {
  private _maximumStartingBid: number;
  private _lowestBid: number;

  constructor(
    auction: AuctionParameters & {
      maximumStartingBid: number;
      lowestBid: number;
    }
  ) {
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

  public override get sum(): number {
    return this._lowestBid;
  }

  public override get sumDescription(): string {
    return this._lowestBid === this._maximumStartingBid
      ? 'maximum starting bid'
      : 'lowest bid';
  }

  public override get auctionType(): AuctionType {
    return AuctionType.reverse;
  }

  public override complete(): void {}
}
