import {
    CreditCardDTO,
    IBANDTO,
    PaymentMethodDTO,
} from '../DTOs/paymentMethod.dto';
import { paymentMethodType } from '../enums/paymentMethodType.enum';

export abstract class PaymentMethod {
    protected _id: string;

    constructor(dto: PaymentMethodDTO) {
        this._id = dto.id;
    }

    public get id(): string {
        return this._id;
    }

    public abstract get type(): paymentMethodType;

    public abstract get identifyingNumber(): string;
}

export class CreditCard extends PaymentMethod {
    private _cardNumber: string;

    constructor(dto: CreditCardDTO) {
        super(dto);
        this._cardNumber = dto.cardNumber;
    }

    public get type(): paymentMethodType {
        return paymentMethodType.paying;
    }

    public get identifyingNumber(): string {
        return this._cardNumber;
    }
}

export class IBAN extends PaymentMethod {
    private _iban: string;

    constructor(dto: IBANDTO) {
        super(dto);
        this._iban = dto.iban;
    }

    public get type(): paymentMethodType {
        return paymentMethodType.receiving;
    }

    public get identifyingNumber(): string {
        return this._iban;
    }
}
