import {
    CreditCardDTO,
    IBANDTO,
    PaymentMethodDTO,
} from '../dtos/payment-method.dto';
import { PaymentMethodCategory } from '../enums/payment-method-category.enum';
import { PaymentMethodType } from '../enums/payment-method-type.enum';

export abstract class PaymentMethod {
    protected _id: string;

    constructor(dto: PaymentMethodDTO) {
        this._id = `${dto.id}`;
    }

    public get id(): string {
        return this._id;
    }

    public abstract get category(): PaymentMethodCategory;

    public abstract get type(): PaymentMethodType;

    public abstract get identifyingNumber(): string;
}

export class CreditCard extends PaymentMethod {
    private _cardNumberLastDigits: string;

    constructor(dto: CreditCardDTO) {
        super(dto);
        this._cardNumberLastDigits = dto.last4digits;
    }

    public get category(): PaymentMethodCategory {
        return PaymentMethodCategory.paying;
    }

    public get type(): PaymentMethodType {
        return PaymentMethodType.creditCard;
    }

    public get identifyingNumber(): string {
        return this._cardNumberLastDigits;
    }
}

export class IBAN extends PaymentMethod {
    private _iban: string;

    constructor(dto: IBANDTO) {
        super(dto);
        this._iban = dto.iban;
    }

    public get category(): PaymentMethodCategory {
        return PaymentMethodCategory.receiving;
    }

    public get type(): PaymentMethodType {
        return PaymentMethodType.IBAN;
    }

    public get identifyingNumber(): string {
        return this._iban;
    }
}
