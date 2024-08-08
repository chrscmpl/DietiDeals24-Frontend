import { AuctionConclusionOptions } from '../enums/auction-conclusion-options.enum';
import {
    NewChosenPaymentMethodDTO,
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
          newPaymentMethod: NewChosenPaymentMethodDTO;
      };
