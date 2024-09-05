import { AuthorizedPaymentMethod } from './authorized-payment-method.model';

type chosenPaymentMethod = {
    id?: string;
    save?: boolean;
    data?: AuthorizedPaymentMethod;
};

export class BidCreationData {
    private _auctionId: string;
    private _amount: number;
    private _paymentMethod: chosenPaymentMethod;

    public constructor(
        auctionId: string,
        amount: number,
        paymentMethod: chosenPaymentMethod,
    ) {
        this._auctionId = auctionId;
        this._amount = amount;
        this._paymentMethod = paymentMethod;
    }

    public get auctionId(): string {
        return this._auctionId;
    }

    public get amount(): number {
        return this._amount;
    }

    public get paymentMethod(): chosenPaymentMethod {
        return this._paymentMethod;
    }
}
