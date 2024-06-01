import {Address} from './address';
import {LoggedinUser} from './loggedinUser';
import {AppUser} from './appUser';


export interface Seller {
  id: number;
  name: string;
  vatIdentificationNumber: string;
  address?: Address;
  appUser?: AppUser;
}
