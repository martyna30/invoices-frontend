import {Address} from './address';

export interface Seller {
  id: number;
  name: string;
  vatIdentificationNumber: number;
  adress?: Address;
}
