export abstract class AuthorizedPaymentMethod {}

export class AuthorizedCreditCard {
    protected _token: string;
    protected _cardNumberLastDigits: string;

    public constructor(token: string, cardNumberLastDigits: string) {
        this._token = token;
        this._cardNumberLastDigits = cardNumberLastDigits;
    }

    public get token(): string {
        return this._token;
    }

    public get cardNumberLastDigits(): string {
        return this._cardNumberLastDigits;
    }
}

export class AuthorizedIBAN {
    protected _iban: string;

    public constructor(iban: string) {
        this._iban = iban;
    }

    public get iban() {
        return this._iban;
    }
}
