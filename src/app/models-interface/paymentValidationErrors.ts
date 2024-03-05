import {ContractorDto} from './contractorDto';
import {Item} from './item';
export interface PaymentValidationErrors {
  dateOfPayment?: Date;
  methodOfPayment?: string;
  paid?: number;

}
