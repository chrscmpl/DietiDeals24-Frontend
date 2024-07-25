import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../DTOs/auction.dto';
import { AuctionType } from '../typeUtils/auction.utils';
import { AuctionSummary } from './auction.summary.model';

export abstract class Auction extends AuctionSummary {
    private _description: string;
    private _bids: number;
    private _username: string;
    private _pictures: string[];

    constructor(auction: AuctionDTO) {
        super(auction);
        this._description = auction.description;
        this._bids = auction.bids;
        this._username = auction.username;
        this._pictures = auction.pictures;
    }

    public get description(): string {
        return this._description;
    }

    public get bids(): number {
        return this._bids;
    }

    public get username(): string {
        return this._username;
    }

    public get pictures(): string[] {
        return this._pictures;
    }
}

export class SilentAuction extends Auction {
    private _minimumBid: number;
    constructor(auction: SilentAuctionDTO) {
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

export class ReverseAuction extends Auction {
    private _maximumStartingBid: number;
    private _lowestBid: number;

    constructor(auction: ReverseAuctionDTO) {
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
