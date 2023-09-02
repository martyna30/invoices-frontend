// @ts-ignore
import {Item} from './item';
import {Contractor} from './contractor';
import {ContractorDto} from './contractorDto';
import {ContractorValidationError} from './contractorValidationError';
export interface InvoiceValidationError {
  contractorDto?: ContractorDto;
dateOfInvoice?: Date;
dateOfSale?: Date;
dateOfPayment?: Date;
methodOfPayment?: string;
paid?: number;
leftToPay?: number;
items?: Array<Item>;
}
