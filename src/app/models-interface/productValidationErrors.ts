export interface ProductValidationErrors {
  paid: string;
  nameOfProduct: string;
  type: string;
  unit: string;
  code: string;
  state?: number;
  netWorth: number;
  vatRate?: number;
  grossValue?: number;

}
