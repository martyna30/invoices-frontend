import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Invoice} from '../models-interface/invoice';
import {Observable} from 'rxjs';
import {ListInvoices} from '../models-interface/listInvoices';
import {Contractor} from '../models-interface/contractor';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/invoice/';
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
  updateInvoice(invoice: Invoice) {
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

  deleteInvoice(id: number): Observable<{}>{
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
    return this.http.get<Array<Contractor>>(this.URL_DB + 'getBuyerWithSpecifiedName', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param
    });
  }
}
