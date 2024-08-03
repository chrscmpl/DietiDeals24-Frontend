import { PaymentMethodType } from '../enums/payment-method-type';

export interface PaymentMethodDTO {
    type: PaymentMethodType;
    id: string;
}

export interface CreditCardDTO extends PaymentMethodDTO {
    type: PaymentMethodType.creditCard;
    cardNumberLastDigits: string;
}

export interface IBANDTO extends PaymentMethodDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

interface CreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    cardNumberLastDigits: string;
    token: string;
}

interface IBANRegistrationDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

export type PaymentMethodRegistrationDTO =
    | CreditCardRegistrationDTO
    | IBANRegistrationDTO;

export interface SavedChosenPaymentMethodDTO {
    id: string;
}

export interface NewChosenPaymentMethodDTO {
    save: boolean;
    newMethod: PaymentMethodRegistrationDTO;
}

export type ChosenPaymentMethodDTO =
    | SavedChosenPaymentMethodDTO
    | NewChosenPaymentMethodDTO;
