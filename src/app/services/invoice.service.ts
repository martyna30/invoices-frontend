import { Injectable } from '@angular/core';
import {Invoice} from '../models-interface/invoice';
import {HttpService} from './http.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Contractor} from '../models-interface/contractor';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private invoiceListObs$ = new BehaviorSubject<Array<Invoice>>([]);
  private totalCountInvoices$ = new BehaviorSubject<number>(0);

  constructor(private httpService: HttpService) {
    this.getInvoicesFromService();
  }

  // tslint:disable-next-line:typedef
  saveInvoice(invoice: Invoice): Observable<Invoice>{
   return this.httpService.saveInvoice(invoice);
  }


  getInvoiceById(idProduct: number): Observable<Invoice> {
    return this.httpService.getInvoiceById(idProduct);
  }
  // tslint:disable-next-line:typedef
  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.httpService.updateInvoice(invoice);
  }

  // tslint:disable-next-line:typedef
  getInvoicesListObservable(page: number, size: number) {
   this.httpService.getInvoices(page, size).subscribe((listInvoice) => {
      this.invoiceListObs$.next(listInvoice.invoices);
      this.totalCountInvoices$.next(listInvoice.total);
    });
  }

  getInvoicesFromService(): Observable<Array<Invoice>> {
    return this.invoiceListObs$.asObservable();
  }

  getTotalCountInvoices(): Observable<number> {
    return this.totalCountInvoices$.asObservable();
  }

  deleteInvoice(id: number): Observable<Invoice> {
    return this.httpService.deleteInvoice(id);
  }


  updateContractor(contractor: Contractor): Observable<Contractor> {
    return this.httpService.updateContractor(contractor);
  }

  saveInvoiceWithoutContractor(invoice: Invoice): Observable<Invoice> {
    return this.httpService.saveInvoiceWithoutContractor(invoice);
  }

  generateInvoice(idInvoice: number) {
    return this.httpService.generateInvoice(idInvoice);
  }
}
