
import {AddressDto} from './addressDto';

export interface SellerValidationError {
  name?: string;
  vatIdentificationNumber?: string;
  addressDto?: AddressDto;
}
