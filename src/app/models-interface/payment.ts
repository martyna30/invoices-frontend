import {Invoice} from './invoice';
import {PaymentStatus} from './PaymentStatus';

export interface Payment {
  id: number;
  methodOfPayment: string;
  paid: number;
  dateOfPayment: Date;
  isPrime?: PaymentStatus;
}
