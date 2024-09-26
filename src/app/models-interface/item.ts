import {Product} from './product';

export interface Item {
  id: number;
  number: number;
  nameOfProduct: string;
  unit: string;
  amount: number;
  netWorth: number;
  vatRate?: number;
  grossValue: number;

}
