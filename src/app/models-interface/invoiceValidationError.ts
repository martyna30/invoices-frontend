// @ts-ignore
import {Item} from './item';
import {Contractor} from './contractor';
import {ContractorDto} from './contractorDto';
import {ContractorValidationError} from './contractorValidationError';
import {Rate} from './rate';
export interface InvoiceValidationError {
  contractorDto?: ContractorDto;
dateOfInvoice?: Date;
dateOfSale?: Date;
dateOfPayment?: Date;
methodOfPayment?: string;
paid?: number;
rate?: Rate;
leftToPay?: number;
items?: Array<Item>;
}
