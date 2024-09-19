import { PaymentMethodType } from '../enums/payment-method-type.enum';

export abstract class UnauthorizedPaymentMethod {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static from(object: { [key: string]: any }) {
        const month = object['expirationDate']?.split('/')[0];
        const year = Number(`20${object['expirationDate']?.split('/')[1]}`);
        if (!object['type']) return null;
        return object['type'] === PaymentMethodType.IBAN
            ? new UnauthorizedIBAN(object['iban'])
            : new UnauthorizedCreditCard(
                  object['ownerName'],
                  object['cardNumber'],
                  new Date(year, month),
                  object['cvv'],
              );
    }
}

export class UnauthorizedCreditCard {
    protected _ownerName: string;
    protected _cardNumber: string;
    protected _expirationDate: Date;
    protected _cvv: string;

    public constructor(
        ownerName: string,
        cardNumber: string,
        expirationDate: Date,
        cvv: string,
    ) {
        this._ownerName = ownerName;
        this._cardNumber = cardNumber;
        this._expirationDate = expirationDate;
        this._cvv = cvv;
    }

    public get ownerName() {
        return this._ownerName;
    }

    public get cardNumber() {
        return this._cardNumber;
    }

    public get expirationDate() {
        return this._expirationDate;
    }

    public get cvv() {
        return this._cvv;
    }
}

export class UnauthorizedIBAN {
    protected _iban: string;

    public constructor(iban: string) {
        this._iban = iban;
    }

    public get iban() {
        return this._iban;
    }
}
