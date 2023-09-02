import {Invoice} from './invoice';
import {Contractor} from './contractor';

export interface ListContractors {
  total: number;
  contractors: Array<Contractor>;
}
