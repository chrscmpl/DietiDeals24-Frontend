import { ChosenPaymentMethodDTO } from './payment-method.dto';

export interface BidDTO {
    id: string;
    auctionId: string;
    amount: number;
}

export interface BidCreationDTO {
    auctionId: string;
    amount: number;
    paymentMethod: ChosenPaymentMethodDTO;
}
