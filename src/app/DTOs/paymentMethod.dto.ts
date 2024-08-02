export interface PaymentMethodDTO {
    type: string;
    id: string;
}

export interface CreditCardDTO extends PaymentMethodDTO {
    cardNumber: string;
}

export interface IBANDTO extends PaymentMethodDTO {
    iban: string;
}
