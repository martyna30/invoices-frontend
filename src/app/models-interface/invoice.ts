import {Item} from './item';
import {Contractor} from './contractor';
import {ContractorDto} from './contractorDto';
import {Payment} from './payment';
import {InvoiceStatus} from './invoiceStatus';

// tslint:disable-next-line:class-name
export interface Invoice {
  id: number;
  number?: number;
  contractor: ContractorDto;
  dateOfInvoice: Date;
  dateOfSale: Date;
  dateOfPayment?: Date;
  periodOfPayment: string;
  methodOfPayment: Array<string>;
  paid: number; //faktura
  amountPaid?: number; // co to?
  leftToPay?: number;//tabela
  //payments?: Array<Payment>;
  isSettled?: InvoiceStatus;
  items: Array<Item>;
  sumTotal: number;
  netAmount: number;
  amountOfVAT?: number;

}
