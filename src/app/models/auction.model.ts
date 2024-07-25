import {
    AuctionDTO,
    ReverseAuctionDTO,
    SilentAuctionDTO,
} from '../DTOs/auction.dto';
import { AuctionType } from '../typeUtils/auction.utils';
import { AuctionSummary } from './auction.summary.model';

export abstract class Auction extends AuctionSummary {
    private _category: string;
    private _description: string | null;
    private _bids: number | null;
    private _username: string;
    private _profilePictureUrl: string | null;
    private _picturesUrls: string[];

    constructor(dto: AuctionDTO) {
        super(dto);
        this._category = dto.category;
        this._description = dto.description ?? null;
        this._bids = dto.bids ?? null;
        this._username = dto.username;
        this._profilePictureUrl = dto.profilePictureUrl ?? null;
        this._picturesUrls = dto.picturesUrls;
    }

    public get category(): string {
        return this._category;
    }

    public get description(): string | null {
        return this._description;
    }

    public get bids(): number | null {
        return this._bids;
    }

    public get username(): string {
        return this._username;
    }

    public get profilePictureUrl(): string | null {
        return this._profilePictureUrl;
    }

    public get picturesUrls(): string[] {
        return this._picturesUrls;
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
