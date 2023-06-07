import {Item} from './item';
import {Contractor} from './contractor';

// tslint:disable-next-line:class-name
export interface Invoice {
  id: number;
  number?: number;
  contractor: Contractor;
  dateOfInvoice: Date;
  dateOfSale: Date;
  dateOfPayment?: Date;
  periodOfPayment: number;
  datePayment?: Date;
  methodOfPayment: Array<string>;
  paid: number;
  amountPaid?: number; // faktura
  leftToPay?: number;//tabela
  items: Array<Item>;
  sumTotal: number;
  netAmount: number;
  amountOfVAT?: number;
}
