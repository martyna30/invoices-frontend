export interface Product {
  id: number;
  nameOfProduct: string;
  type: string;
  unit: string;
  code: string;
  netWorth: number;
  vatRate?: number;
  grossValue?: number;

}
