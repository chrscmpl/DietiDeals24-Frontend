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

interface UnauthorizedCreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

interface IBANRegistrationDTO {
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

export interface NewChosenPaymentMethodDTO {
    save: boolean;
    newMethod: AuthorizedPaymentMethodRegistrationDTO;
}
