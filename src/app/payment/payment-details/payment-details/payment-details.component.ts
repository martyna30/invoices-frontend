import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SellerValidationError} from '../../../models-interface/sellerValidationError';
import {AppUser} from '../../../models-interface/appUser';
import {MethodOfPayment} from '../../../models-interface/methodOfPayment';
import {PaymentValidationErrors} from '../../../models-interface/paymentValidationErrors';
import {formatDate} from '@angular/common';
import {Observable} from 'rxjs';
import {Payment} from '../../../models-interface/payment';
import {PaymentService} from '../../../services/payment.service';
import {SettleInvoiceComponent} from '../../../invoices/settle-invoice/settle-invoice/settle-invoice.component';
import {CheckboxService} from '../../../services/checkbox.service';
import {InvoicesMapComponent} from '../../../checkbox-component/invoices-map/invoices-map/invoices-map.component';
import {PaymentsMapComponent} from '../../../checkbox-component/payments-map/payments-map/payments-map.component';
import {DeletePaymentComponent} from '../../delete-payment/delete-payment/delete-payment.component';
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
  validationErrors: PaymentValidationErrors;
  username: string;
  isDisabled: false;
  @ViewChild('childSettleInvoice')
  settleInvoice: SettleInvoiceComponent;
  @ViewChild('childPaymentsMap')
  paymentsMap: PaymentsMapComponent;
  @ViewChild('childInvoicesMap')
  invoiceMap: InvoicesMapComponent;
  @ViewChild('childDeleteRef')
  deleteComponent: DeletePaymentComponent;
  @Input()
  private invoiceId: number;
  idPayment: number;
  checkboxOfPayment: number;
  paymentIsPrime$: Observable<Payment>;
  @Input()
  detailsIsHidden: boolean;
  value: 'Cash';
  private timeoutId1;
  private timeoutId2;
  private checkedList: Map<number, number>;


  constructor(private fb: FormBuilder, private paymentService: PaymentService, private checkboxService: CheckboxService) {
  }


  ngOnInit() {
    this.getPaymentsListFromService();
  }

  /*private checkOrPaymentIsPrime() {
    this.paymentIsPrime$ = this.paymentService.getPrimePaymentFromService();
    this.paymentService.findPrimePayment();
  }*/


  getPaymentsListForInvoice(invoiceId: number) {
    // this.paymentService.currentInvoiceId$.next(this.invoiceId);
    this.invoiceId = invoiceId;
    return new Promise(() => {
    this.paymentService.getPaymentsListObservableByInvoice(this.invoiceId);
    // this.showInvoiceDetails();to
    this.timeoutId2 = setTimeout(() => {
      // tslint:disable-n
     }, 200);
    });
  }

  getPaymentsListFromService() {
    this.paymentsList$ = this.paymentService.getPaymentsListFromService();
  }


  addNextPayment() {
    this.settleInvoice.addPaymentForInvoice();
  }


  deletePayment() {
    this.deleteComponent.deletePayment();
  }



  async loadData() {
    this.invoiceId = this.invoiceMap.getInvoiceIdFromMap();
    await this.getPaymentsListForInvoice(this.invoiceId);
    // this.paymentsMap.refresh();
  }



  showInvoiceDetails() {
    // this.invoiceId = invoiceId;
    if (this.detailsIsHidden) {
      this.detailsIsHidden = !this.detailsIsHidden;
    } else {
      this.detailsIsHidden = true;
    }
  }

  closeDialog() {
    this.detailsIsHidden = true;
    //this.checkboxService.removeFromInvoicesMap(this.invoiceId);
    //console.log(this.invoiceId);
    this.settleInvoice.clearPaymentForm();
  }
  /*public addNextPayment() {
    this.payments.push(this.createPayment());
    ///  <button type="button" class="c-btn c-btn--accent" (click)="addNextPayment()">Add</button>
  }*/


  changeCheckboxList(checkbox: HTMLInputElement) {
    if (checkbox.checked) {
      this.checkboxOfPayment = Number(checkbox.value);
      this.checkboxService.addToPaymentsMap(this.checkboxOfPayment);
    } else {
      this.checkboxService.removeFromPaymentsMap(this.checkboxOfPayment);
    }
  }


}
