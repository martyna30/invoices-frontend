import {Address} from './address';

export interface Contractor {

  id: number;
  name: string;
  vatIdentificationNumber: string;
  address?: Address;
}
