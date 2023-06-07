export interface Item {
  id: number;
  product: string;
  amount: number;
  netWorth: number;
  vatRate?: number;
  grossValue: number;

}
