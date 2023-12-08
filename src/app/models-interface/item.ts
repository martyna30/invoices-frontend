export interface Item {
  id: number;
  number: number;
  product: string;
  unit: string;
  amount: number;
  netWorth: number;
  vatRate?: number;
  grossValue: number;

}
