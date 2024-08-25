import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import { AuthorizedPaymentMethodRegistrationDTO } from './payment-method.dto';

export type AuctionConclusionDTO =
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.reject;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          paymentMethodId: string;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          OneTimePaymentMethod: AuthorizedPaymentMethodRegistrationDTO;
      };
