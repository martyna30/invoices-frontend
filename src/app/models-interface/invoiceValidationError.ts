// @ts-ignore
import {Item} from './item';
import {Contractor} from './contractor';
export interface InvoiceValidationError {
  contractor?: Array<Contractor>;
dateOfInvoice?: Date;
dateOfSale?: Date;
dateOfPayment?: Date;
methodOfPayment?: string;
paid?: number;
amountPaid?: number;
leftToPay?: number;
items?: Array<Item>;
}
