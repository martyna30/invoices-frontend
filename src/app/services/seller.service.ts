import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Contractor} from '../models-interface/contractor';
import {Seller} from '../models-interface/seller';
import {HttpService} from './http.service';
import {map} from 'rxjs/operators';
import {UserAuthService} from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  currentSeller$ = new BehaviorSubject<Seller>(null);

  constructor(private httpService: HttpService ) {}



  /*getSeller(username) {//usun
    //return new Promise((resolve, reject) => {
      return this.getSellerByAppUser(username);
      //this.timeoutId = setTimeout( resolve, timeout);
      //const timeoutId = setTimeout( resolve, timeout);
    //});
  }*/

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

  getSellerFromGus(nip: string) {
    return this.httpService.getSellerByNip(nip);
  }

  getSellerByAppUser(loggedInUsername: string)  {
    this.httpService.getSellerByAppUser(loggedInUsername).subscribe(seller => {
      this.currentSeller$.next(seller);
      console.log(seller);
      localStorage.setItem('currentSeller', seller.name);
    });
  }

  getSellerFromService() {
  return this.currentSeller$.asObservable();
  }


}
