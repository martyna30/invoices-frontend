import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Invoice} from '../models-interface/invoice';
import {Observable} from 'rxjs';
import {ListInvoices} from '../models-interface/listInvoices';
import {Contractor} from '../models-interface/contractor';
import {ListContractors} from '../models-interface/listContractors';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/invoice/';
  private URL_DB_CONTRACTOR = 'http://localhost:8080/v1/contractor/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private httpHeader2 = {headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};

  constructor(private http: HttpClient) { }

  saveInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.URL_DB + 'createInvoice', invoice, {
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

}
