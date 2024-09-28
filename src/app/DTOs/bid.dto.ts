import { AuthorizedPaymentMethodRegistrationDTO } from './payment-method.dto';

export interface BidDTO {
    id: string;
    auctionId: string;
    amount: number;
}

export type BidCreationDTO =
    | {
          auctionId: string;
          bidAmount: number;
          paymentMethodId: string;
      }
    | {
          auctionId: string;
          bidAmount: number;
          paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO;
      }
    | {
          auctionId: string;
          bidAmount: number;
          oneTimePaymentMethod: AuthorizedPaymentMethodRegistrationDTO;
      };
