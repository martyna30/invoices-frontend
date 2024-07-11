import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Invoice} from '../models-interface/invoice';
import {Observable} from 'rxjs';
import {ListInvoices} from '../models-interface/listInvoices';
import {Contractor} from '../models-interface/contractor';
import {ListContractors} from '../models-interface/listContractors';
import {UserDto} from '../models-interface/userDto';
import {Token} from '@angular/compiler';
import {NewUserDto} from '../models-interface/newUserDto';
import {Seller} from '../models-interface/seller';
import {AppUser} from '../models-interface/appUser';
import {ContractorFromGusDto} from '../models-interface/contractorFromGusDto';
import {ContractorDto} from '../models-interface/contractorDto';
import {map, max} from 'rxjs/operators';
import {Payment} from '../models-interface/payment';
import {Rate} from '../models-interface/rate';
import {FormControl} from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/invoice/';
  private URL_DB_NBP = 'http://localhost:8080/v1/nbp/';
  private URL_DB_CONTRACTOR = 'http://localhost:8080/v1/contractor/';
  private URL_DB_SELLER = 'http://localhost:8080/v1/seller/';
  private URL_DB_GUS = 'http://localhost:8080/v1/gus/';
  private URL_DB_PRINT = 'http://localhost:8080/v1/invoice/printer/';
  private URL_DB_PAYMENT = 'http://localhost:8080/v1/payment/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'}), headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};


  constructor(private http: HttpClient) { }

  saveInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.URL_DB + 'createInvoice', invoice, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  saveInvoiceWithoutContractor(invoice: Invoice): Observable<Invoice>{
    return this.http.post<Invoice>(this.URL_DB + 'createInvoiceWithoutContractor', invoice, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }
  getInvoiceById(id: number): Observable<Invoice> {
    const param = new HttpParams()
      .set('invoiceId', id + '');
    const Headers = this.httpHeader;
    return this.http.get<Invoice>(this.URL_DB + 'getInvoice', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  // tslint:disable-next-line:typedef
  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(this.URL_DB + 'updateInvoice', invoice, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }



  getInvoices(page: number, size: number): Observable<ListInvoices> {
    const param = new HttpParams()
      .set('page', page + '')
      .set('size', size + '');
    return this.http.get<ListInvoices>(this.URL_DB + 'getInvoices', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });

  }

  deleteInvoice(id: number): Observable<Invoice>{
    const param = new HttpParams()
      .set('invoiceId', id + '');
    return this.http.delete<Invoice>(this.URL_DB + 'deleteInvoice', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }

  getBuyerWithSpecifiedName(name: string): Observable<Array<Contractor>> {
    const param = new HttpParams()
      .set('name', name + '');
    return this.http.get<Array<Contractor>>(this.URL_DB_CONTRACTOR + 'getContractorWithSpecifiedName', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param
    });
  }

  getContractors(page: number, size: number): Observable<ListContractors>{
    const param = new HttpParams()
      .set('page', page + '')
      .set('size', size + '');
    return this.http.get<ListContractors>(this.URL_DB_CONTRACTOR + 'getContractors', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }

  getContractorById(id: number): Observable<Contractor>  {
    const param = new HttpParams()
      .set('contractorId', id + '');
    const Headers = this.httpHeader;
    return this.http.get<Contractor>(this.URL_DB_CONTRACTOR + 'getContractor', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  getContractorByName(name: string): Observable<Contractor>  {
    const param = new HttpParams()
      .set('name', name );
    const Headers = this.httpHeader;
    return this.http.get<Contractor>(this.URL_DB_CONTRACTOR + 'getContractorByName', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }
  // tslint:disable-next-line:typedef
  saveContractor(contractor: Contractor): Observable<Contractor> {
    return this.http.post<Contractor>(this.URL_DB_CONTRACTOR + 'createContractor', contractor, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }
  updateContractor(contractor: Contractor): Observable<Contractor> {
    return this.http.put<Contractor>(this.URL_DB_CONTRACTOR + 'updateContractor', contractor, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  deleteContractor(contractorId: number): Observable<Contractor> {
    const param = new HttpParams()
      .set('contractorId', contractorId + '');
    return this.http.delete<Contractor>(this.URL_DB_CONTRACTOR + 'deleteContractor', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }


  generateToken(userDto: UserDto) {
    const param = new HttpParams()
      .set('username', userDto.username + '')
      .set('password', userDto.password + '');
    return this.http.post<Token>(this.URL_DB + 'login', userDto, {
      responseType: 'json',
      observe: 'body',
      params: param
    });
  }

  register(user: NewUserDto): Observable<NewUserDto> {
    return this.http.post<NewUserDto>(this.URL_DB + 'register', user, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body'
    });
  }


  logout() {
    return this.http.post(this.URL_DB + 'logout', {}, {});
  }

  getSellerByName(name) {
    const param = new HttpParams()
      .set('name', name );
    const Headers = this.httpHeader;
    return this.http.get<Seller>(this.URL_DB_SELLER + 'getSellerByName', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  getSellerById(id: number) {
    const param = new HttpParams()
      .set('sellerId', id + '');
    const Headers = this.httpHeader;
    return this.http.get<Seller>(this.URL_DB_SELLER + 'getSeller', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  updateSeller(seller: Seller) {
    return this.http.put<Seller>(this.URL_DB_SELLER + 'updateSeller', seller, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  saveSeller(seller: Seller) {
    return this.http.post<Seller>(this.URL_DB_SELLER + 'createSeller', seller, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }
  deleteSeller(idSeller: number) {
    const param = new HttpParams()
      .set('sellerId', idSeller + '');
    return this.http.delete<Seller>(this.URL_DB_SELLER + 'deleteSeller', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }

  getSellerByVatIdentificationNumber(vatIdentificationNumber: string) {
    const param = new HttpParams()
      .set('vatIdentificationNumber', vatIdentificationNumber);
    return this.http.get<Seller>(this.URL_DB_SELLER + 'getSellerByVatIdentificationNumber', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }

  // tslint:disable-next-line:typedef
  getSellerByAppUser(username: string) {
    const param = new HttpParams()
      .set('username', username );
    const Headers = this.httpHeader;
    return this.http.get<Seller>(this.URL_DB_SELLER + 'getSellerByAppUser', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  getUserByUsername(username: string) {
    const param = new HttpParams()
      .set('username', username );
    const Headers = this.httpHeader;
    return this.http.get<AppUser>(this.URL_DB + 'getAppUserByUsername', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }


  getContractorByNip(nip: string) {
    const param = new HttpParams()
      .set('nip', nip);
    return this.http.get<ContractorDto>(this.URL_DB_GUS + 'getContractorFromGus', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  getSellerByNip(nip: string) {
    const param = new HttpParams()
      .set('nip', nip);
    return this.http.get<Seller>(this.URL_DB_GUS + 'getSellerFromGus', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }

  generateInvoice(idInvoice: number, currentSellerId: number): Observable<any>{
    const param = new HttpParams()
      .set('invoiceId', idInvoice + '')
      .set('currentSellerId', String(currentSellerId));
    return this.http.get<any>(this.URL_DB_PRINT + 'generateInvoice', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'response',
      params: param,
      responseType: 'blob' as 'json'
    });
  }


  savePayment(payment: Payment, idInvoice: number): Observable<Payment> {
    const param = new HttpParams()
      .set('invoiceId', idInvoice + '');
    return this.http.post<Payment>(this.URL_DB_PAYMENT + 'createPayment', payment, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
    });
  }




  getPaymentsByInvoiceId(invoiceId: number): Observable<Array<Payment>> {
    const param = new HttpParams()
      .set('invoiceId', invoiceId + '');
    return this.http.get<Array<Payment>>(this.URL_DB_PAYMENT + 'getPaymentsByInvoiceId', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
      observe: 'body',
    });
  }


  deletePayment(paymentId: number): Observable<Payment> {
    const param = new HttpParams()
      .set('paymentId' , paymentId.toString());
    return this.http.delete<Payment>(this.URL_DB_PAYMENT + 'deletePayment', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }


  settlePayment(payment: Payment, idInvoice: number) {
   const param = new HttpParams()
      .set('invoiceId', idInvoice + '');
   return this.http.post<Payment>(this.URL_DB_PAYMENT + 'settlePayment', payment, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      params: param,
    });
  }


  getRateByCurrency(currency: string, date: Date): Observable<Rate> {
    const param = new HttpParams()
      .set('currency', currency)
      .set('effectiveDate', date + '');
    return this.http.get<Rate>(this.URL_DB_NBP + 'getRateByCurrency', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      responseType: 'json',
      params: param
    });
  }






}

