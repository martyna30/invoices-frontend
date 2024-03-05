import {Invoice} from './invoice';

export interface Payment {
  id: number;
  methodOfPayment: string;
  paid: number;
  dateOfPayment: Date;
}
