import {Item} from './item';
import {Contractor} from './contractor';
import {ContractorDto} from './contractorDto';
import {Payment} from './payment';
import {InvoiceStatus} from './invoiceStatus';
import {Seller} from './seller';
import {Rate} from './rate';

// tslint:disable-next-line:class-name
export interface Invoice {
  id: number;
  number?: number;
  contractor?: ContractorDto;
  seller: Seller;
  dateOfInvoice: Date;
  dateOfSale: Date;
  dateOfPayment?: Date;
  periodOfPayment: string;
  methodOfPayment: Array<string>;
  paid: number;
  rate: Rate;
  amountPaid?: number;
  leftToPay?: number;
  isSettled?: InvoiceStatus;
  items: Array<Item>;
  sumTotal: number;
  netAmount: number;
  amountOfVAT?: number;

}
