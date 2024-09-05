import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import { AuthorizedPaymentMethod } from './authorized-payment-method.model';

type chosenPaymentMethod = {
    id?: string;
    save?: boolean;
    data?: AuthorizedPaymentMethod;
};

export class AuctionConclusionData {
    private _auctionId: string;
    private _choice: AuctionConclusionOptions;
    private _paymentMethod: chosenPaymentMethod | null = null;

    public constructor(
        auctionId: string,
        choice: AuctionConclusionOptions,
        paymentMethod?: chosenPaymentMethod,
    ) {
        this._auctionId = auctionId;
        this._choice = choice;
        this._paymentMethod = paymentMethod ?? null;
    }

    public get auctionId(): string {
        return this._auctionId;
    }

    public get choice(): AuctionConclusionOptions {
        return this._choice;
    }

    public get paymentMethod(): chosenPaymentMethod | null {
        return this._paymentMethod;
    }
}
