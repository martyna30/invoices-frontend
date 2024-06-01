import {Address} from './address';

export interface ContractorDto {
  id: number;
  name?: string;
  vatIdentificationNumber?: string;
  address?: Address;
}
