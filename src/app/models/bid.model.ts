import { BidDTO } from '../DTOs/bid.dto';

export class Bid {
    private _id: string;
    private _auctionId: string;
    private _amount: number;

    public constructor(dto: BidDTO) {
        this._id = dto.id;
        this._auctionId = dto.auctionId;
        this._amount = dto.amount;
    }

    public get id(): string {
        return this._id;
    }

    public get auctionId(): string {
        return this._auctionId;
    }

    public get amount(): number {
        return this._amount;
    }
}
