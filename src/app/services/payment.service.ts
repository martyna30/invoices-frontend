import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Invoice} from '../models-interface/invoice';
import {BehaviorSubject, Observable} from 'rxjs';
import {Payment} from '../models-interface/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentsListObs$ = new BehaviorSubject<Array<Payment>>([]);
  constructor(private httpService: HttpService) {
  }

    savePayment(payment: Payment, idInvoice: number): Observable<Payment>{
    return this.httpService.savePayment(payment, idInvoice);
  }

  getPaymentsListObservableByInvoice(invoiceId: number): void {
    this.httpService.getPaymentsByInvoiceId(invoiceId).subscribe(paymentsList => {
      this.paymentsListObs$.next(paymentsList);
    });
  }

  getPaymentsListFromService(): Observable<Array<Payment>>  {
    return this.paymentsListObs$.asObservable();
  }
}
