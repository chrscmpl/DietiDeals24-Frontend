import { AuthorizedPaymentMethodRegistrationDTO } from './payment-method.dto';

export type AuctionAcceptanceDataDTO =
    | {
          auctionId: string;
          paymentMethodId: string;
      }
    | {
          auctionId: string;
          paymentMethodToBeSaved: AuthorizedPaymentMethodRegistrationDTO;
      }
    | {
          auctionId: string;
          oneTimePaymentMethod: AuthorizedPaymentMethodRegistrationDTO;
      };
