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


  getSellerByName(name) {
    return this.httpService.getSellerByName(name).subscribe((seller) => {
      this.currentSeller$.next(seller);
      localStorage.setItem('currentSeller', seller.name);
    });
  }

  getSellerValue() {
    return this.currentSeller$.getValue();
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

  getSellerByAppUser(loggedInUsername: string): Observable<Seller>  {
    return this.httpService.getSellerByAppUser(loggedInUsername);
  }


  getSellerFromService() {
  return this.currentSeller$.asObservable();
  }




}
