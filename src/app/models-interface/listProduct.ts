import {Product} from './product';

export interface ListProducts {
  total: number;
  products: Array<Product>;
}
