import { PaymentMethodType } from '../enums/payment-method-type';

export interface GetPaymentMethodsResponseDTO {
    creditCards: CreditCardDTO[];
    ibans: IBANDTO[];
}

export interface PaymentMethodDTO {
    id: string;
}

export interface CreditCardDTO extends PaymentMethodDTO {
    cardNumberLastDigits: string;
}

export interface IBANDTO extends PaymentMethodDTO {
    iban: string;
}

export interface UnauthorizedCreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    ownerName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

export interface CreditCardAuthorizationDataDTO {
    token: string;
}

interface AuthorizedCreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    last4digits: string;
    paymentProcessorToken: string;
}

export interface UnauthorizedIBANRegistrationDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

interface AuthorizedIBANRegistrationDTO {
    type: PaymentMethodType.IBAN;
    ibanString: string;
}

export type AuthorizedPaymentMethodRegistrationDTO =
    | AuthorizedCreditCardRegistrationDTO
    | AuthorizedIBANRegistrationDTO;

export type UnauthorizedPaymentMethodRegistrationDTO =
    | UnauthorizedCreditCardRegistrationDTO
    | UnauthorizedIBANRegistrationDTO;

export type ChosenPaymentMethodDTO =
    | { paymentMethodId: string }
    | { paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO }
    | { OneTimePaymentMethod: AuthorizedPaymentMethodRegistrationDTO };
