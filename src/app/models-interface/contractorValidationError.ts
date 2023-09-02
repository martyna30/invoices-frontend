import {Address} from './address';
import {AddressDto} from './addressDto';

export interface ContractorValidationError {

  name?: string;
  vatIdentificationNumber?: string;
  addressDto?: AddressDto;



}
