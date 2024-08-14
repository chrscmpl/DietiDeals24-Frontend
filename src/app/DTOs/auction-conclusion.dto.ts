import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import {
    AuthorizedPaymentMethodRegistrationDTO,
    SavedChosenPaymentMethodDTO,
} from './payment-method.dto';

export type AuctionConclusionDTO =
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.reject;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          savedPaymentMethod: SavedChosenPaymentMethodDTO;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO;
      }
    | {
          auctionId: string;
          choice: AuctionConclusionOptions.accept;
          oneTimeUsePaymentMethod: AuthorizedPaymentMethodRegistrationDTO;
      };
