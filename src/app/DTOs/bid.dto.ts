import {
    AuthorizedPaymentMethodRegistrationDTO,
    SavedChosenPaymentMethodDTO,
} from './payment-method.dto';

export interface BidDTO {
    id: string;
    auctionId: string;
    amount: number;
}

export type BidCreationDTO =
    | {
          auctionId: string;
          amount: number;
          savedPaymentMethod: SavedChosenPaymentMethodDTO;
      }
    | {
          auctionId: string;
          amount: number;
          paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO;
      }
    | {
          auctionId: string;
          amount: number;
          oneTimeUsePaymentMethod: AuthorizedPaymentMethodRegistrationDTO;
      };
