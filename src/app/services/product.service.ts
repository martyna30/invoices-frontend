import { Injectable } from '@angular/core';
import {Invoice} from '../models-interface/invoice';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpService} from './http.service';
import {Payment} from '../models-interface/payment';
import {Product} from '../models-interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsListObs$ = new BehaviorSubject<Array<Product>>([]);
  private totalCountProducts$ = new BehaviorSubject<number>(0);


  constructor(private httpService: HttpService) {
  }

  getProductsListObservable(page: number, size: number) {
    this.httpService.getProducts(page, size).subscribe((listProducts) => {
      this.productsListObs$.next(listProducts.invoices);
      this.totalCountProducts$.next(listProducts.total);
    });
  }

  getProductsFromService(): Observable<Array<Product>> {
    return this.productsListObs$.asObservable();
  }

  getTotalCountProducts(): Observable<number> {
    return this.totalCountProducts$.asObservable();
  }


  getProductById(idProductFromTheCatalog: number) {
    return this.httpService.getProductById(idProductFromTheCatalog);
  }

  saveProduct(product: Product): Observable<Product> {
   return this.httpService.saveProduct(product);
  }

  updateProduct(product: Product) {
    return this.httpService.updateProduct(product);
  }
}
