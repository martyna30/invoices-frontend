import {Item} from './item';
import {Contractor} from './contractor';
import {ContractorDto} from './contractorDto';

// tslint:disable-next-line:class-name
export interface Invoice {
  id: number;
  number?: number;
  contractor: ContractorDto;
  dateOfInvoice: Date;
  dateOfSale: Date;
  dateOfPayment?: Date;
  periodOfPayment: number;
  datePayment?: Date;
  methodOfPayment: Array<string>;
  paid?: number; //faktura
  amountPaid?: number; // co to?
  leftToPay?: number;//tabela
  items: Array<Item>;
  sumTotal: number;
  netAmount: number;
  amountOfVAT?: number;
}
