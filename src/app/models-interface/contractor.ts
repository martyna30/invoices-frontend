import {Address} from './address';

export interface Contractor {

  id: number;
  name: string;
  vatIdentificationNumber: number;
  address?: Address;
}
