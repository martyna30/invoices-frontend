import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Contractor} from '../models-interface/contractor';
import {Seller} from '../models-interface/seller';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private httpService: HttpService) { }

  getSellerWithSpecifiedName(name) {
   // return this.httpService.getSellerWithSpecifiedName(name);
  }

  getSellerByName(name) {
    return this.httpService.getSellerByName(name);
  }

  getSellerById(idSeller: number): Observable<Seller> {
    return this.httpService.getSellerById(idSeller);
  }

  saveSeller(seller: Seller): Observable<Seller> {
    return this.httpService.saveSeller(seller);
  }
  updateSeller(seller: Seller): Observable<Seller> {
    return this.httpService.updateSeller(seller);
  }

  deleteSeller(idSeller: number) {
    return this.httpService.deleteSeller(idSeller);
  }

  getSellerByVatIdentificationNumber(vatIdentificationNumber: string): Observable<any>  {
    return this.httpService.getSellerByVatIdentificationNumber(vatIdentificationNumber);
  }

  getSellerFromGus(nip:string) {
    return this.httpService.getSellerByNip(nip);
  }

  getSellerByAppUser(loggedInUsername: string) {
    return this.httpService.getSellerByAppUser(loggedInUsername);
  }


}
