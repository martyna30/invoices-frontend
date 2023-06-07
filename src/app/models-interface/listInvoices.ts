import {Invoice} from './invoice';

export interface ListInvoices {
  total: number;
  invoices: Array<Invoice>;
}
