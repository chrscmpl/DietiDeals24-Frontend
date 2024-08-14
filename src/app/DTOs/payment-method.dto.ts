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

interface AuthorizedCreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    cardNumberLastDigits: string;
    token: string;
}

export interface UnauthorizedCreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    ownerName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

export interface IBANRegistrationDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

export type AuthorizedPaymentMethodRegistrationDTO =
    | AuthorizedCreditCardRegistrationDTO
    | IBANRegistrationDTO;

export type UnauthorizedPaymentMethodRegistrationDTO =
    | UnauthorizedCreditCardRegistrationDTO
    | IBANRegistrationDTO;

export interface SavedChosenPaymentMethodDTO {
    id: string;
}

export type ChosenPaymentMethodDTO =
    | { savedPaymentMethod: SavedChosenPaymentMethodDTO }
    | { paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO }
    | { oneTimeUsePaymentMethod: AuthorizedPaymentMethodRegistrationDTO };
