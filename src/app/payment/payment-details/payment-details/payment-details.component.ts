import {AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SellerValidationError} from '../../../models-interface/sellerValidationError';
import {AppUser} from '../../../models-interface/appUser';
import {MethodOfPayment} from '../../../models-interface/methodOfPayment';
import {PaymentValidationErrors} from '../../../models-interface/paymentValidationErrors';
import {formatDate} from '@angular/common';
import {Observable} from 'rxjs';
import {Payment} from '../../../models-interface/payment';
import {PaymentService} from '../../../services/payment.service';
import * as console from 'console';
import {timeout} from 'rxjs/operators';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})

export class PaymentDetailsComponent implements OnInit {
  page = 1;
  size = 10;
  total: Observable<number>;
  paymentsList$: Observable<Array<Payment>>;
  payments: Array<Payment>;
  validationErrors: PaymentValidationErrors;
  username: string;
  isDisabled: false;
  @Input()
  invoiceId: number;
  @Input()
  detailsIsHidden;
  value: 'Cash';
  private timeoutId1;
  private timeoutId2;
  constructor(private fb: FormBuilder, private paymentService: PaymentService) { }


//<app-settle-invoice (addPaymentToInvoice)="getPaymentsForInvoice($event)"> </app-settle-invoice>
    ngOnInit() {
      /*this.myFormModel = this.fb.group({
        payments: this.fb.array([]),
      });*/
      this.getPaymentsListFromService();
  }

  getPaymentsListForInvoice(invoiceId: number) {
    this.invoiceId = invoiceId;
    return new Promise(() => {
      this.paymentService.getPaymentsListObservableByInvoice(this.invoiceId);
      this.timeoutId2 = setTimeout(() => {
      }, 1000);
    });
  }

  getPaymentsListFromService() {
    this.paymentsList$ = this.paymentService.getPaymentsListFromService();
  }

  showInvoiceDetails() {
   // this.invoiceId = invoiceId;
    if (this.detailsIsHidden) {
      this.detailsIsHidden = !this.detailsIsHidden;
    } else {
      this.detailsIsHidden = true;
    }
  }



  /*addPaymentToInvoice(currentPayment: number){
   this.payments = this.myFormModel.get('payments') as FormArray;
   this.payments.push(this.createPayment(currentPayment));
  }*/


  closeDialog() {
    this.detailsIsHidden = true;
  }


  /*get paymentsArray() {
    return this.myFormModel.get('payments') as FormArray;
  }*/

  private createPayment(): FormGroup {
    return this.fb.group({
      methodOfPaymentInput: 'Transfer',
      // tslint:disable-next-line:radix
      paidInput: parseInt('0,00'),
      dateOfPaymentInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
    });
  }


  /*public addNextPayment() {
    this.payments.push(this.createPayment());
    ///  <button type="button" class="c-btn c-btn--accent" (click)="addNextPayment()">Add</button>
  }*/




  changeCheckboxList(self: HTMLInputElement) {

  }





}

