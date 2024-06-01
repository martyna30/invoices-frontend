import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Payment} from '../models-interface/payment';
import {PaymentStatus} from '../models-interface/PaymentStatus';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  isPrime$ = new BehaviorSubject<Payment>(null);
  private paymentsListObs$ = new BehaviorSubject<Array<Payment>>([]);
  private currentInvoiceId$ = new BehaviorSubject<number>(null);
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
  // @ts-ignore
  findPrimePayment() {
   this.paymentsListObs$.subscribe(payments => {
   const prime = payments.filter(p => p.isPrime.toString() === ('TRUE')).pop();
   console.log(prime);
   this.isPrime$.next(prime);
   });
  }


  getPrimePaymentFromService(): Observable<Payment>  {
    return this.isPrime$.asObservable();
  }


  getPaymentsListFromService(): Observable<Array<Payment>>  {
    return this.paymentsListObs$.asObservable();
  }


  deletePayment(paymentId: number): Observable<Payment> {
    return this.httpService.deletePayment(paymentId);
  }


  settlePayment(payment: Payment, idInvoice: number) {
    return this.httpService.settlePayment(payment, idInvoice);
  }
}

