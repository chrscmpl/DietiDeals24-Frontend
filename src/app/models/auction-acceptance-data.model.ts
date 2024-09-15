import { AuthorizedPaymentMethod } from './authorized-payment-method.model';

type chosenPaymentMethod = {
    id?: string;
    save?: boolean;
    data?: AuthorizedPaymentMethod;
};

export class AuctionAcceptanceData {
    private _auctionId: string;
    private _paymentMethod: chosenPaymentMethod | null = null;

    public constructor(auctionId: string, paymentMethod?: chosenPaymentMethod) {
        this._auctionId = auctionId;
        this._paymentMethod = paymentMethod ?? null;
    }

    public get auctionId(): string {
        return this._auctionId;
    }

    public get paymentMethod(): chosenPaymentMethod | null {
        return this._paymentMethod;
    }
}
