import { PaymentMethodType } from '../enums/payment-method-type';

export interface PaymentMethodDTO {
    type: PaymentMethodType;
    id: string;
}

export interface CreditCardDTO extends PaymentMethodDTO {
    type: PaymentMethodType.creditCard;
    cardNumber: string;
}

export interface IBANDTO extends PaymentMethodDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

interface CreditCardRegistrationDTO {
    type: PaymentMethodType.creditCard;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

interface IBANRegistrationDTO {
    type: PaymentMethodType.IBAN;
    iban: string;
}

export type PaymentMethodRegistrationDTO =
    | CreditCardRegistrationDTO
    | IBANRegistrationDTO;

export type ChosenPaymentMethodDTO =
    | { id: string }
    | {
          save: boolean;
          newMethod: PaymentMethodRegistrationDTO;
      };
