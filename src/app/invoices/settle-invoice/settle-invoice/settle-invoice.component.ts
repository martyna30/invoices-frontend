import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PaymentValidationErrors} from '../../../models-interface/paymentValidationErrors';
import {MethodOfPayment} from '../../../models-interface/methodOfPayment';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {UserAuthService} from '../../../services/user-auth.service';
import {CheckboxService} from '../../../services/checkbox.service';
import {InvoiceService} from '../../../services/invoice.service';
import {Invoice} from '../../../models-interface/invoice';
import {HttpErrorResponse} from '@angular/common/http';
import {Payment} from '../../../models-interface/payment';
import {PaymentService} from '../../../services/payment.service';
import {formatDate} from '@angular/common';
import {$E} from 'codelyzer/angular/styles/chars';
import {Observable} from 'rxjs';
import {InvoicesMapComponent} from '../../../checkbox-component/invoices-map/invoices-map/invoices-map.component';
import {PaymentsMapComponent} from '../../../checkbox-component/payments-map/payments-map/payments-map.component';

@Component({
  selector: 'app-settle-invoice',
  templateUrl: './settle-invoice.component.html',
  styleUrls: ['./settle-invoice.component.scss']
})
export class SettleInvoiceComponent implements OnInit {
  @Output()
  addPaymentToInvoice = new EventEmitter<number>();
  @ViewChild('childInvoicesMap')
  invoicesMap: InvoicesMapComponent;
  @ViewChild('childPaymentsMap')
  paymentsMap: PaymentsMapComponent;
  settleIsHidden = true;
  private checkedList: Map<number, number>;
  validationErrors: PaymentValidationErrors;
  value: 'Transfer';
  methodsOfPayment: MethodOfPayment[] = [
    {value: 'transfer', viewValue: 'Transfer'},
    {value: 'cash', viewValue: 'Cash'},
  ];
  formModel: FormGroup;
  isloggedin: boolean;
  private idInvoice: number;
  private isCreated: boolean;
  private mode: string;
  private idPayment: number;


  constructor(private fb: FormBuilder, private userService: UserAuthService,
              private checkboxService: CheckboxService,
              private invoiceService: InvoiceService,
              private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.formModel = this.fb.group({
      methodOfPaymentInput: 'Transfer',
      // tslint:disable-next-line:radix
      paidInput: parseInt('0,00'),
      dateOfPaymentInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
    });
    this.checkStatus();
  }

  checkStatus() {
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
    }
  }


  addPaymentForInvoice() {
    this.mode = 'add';
    this.settleIsHidden = false;
    this.ngOnInit();
  }


  settlePayment() {
    this.mode = 'settle';
    this.settleIsHidden = false;
    const isSelectedOne = this.invoicesMap.checkOrInvoicesMapEqualsOne();
    if (isSelectedOne) {
      this.idInvoice = this.invoicesMap.getInvoiceIdFromMap();
      this.invoiceService.getInvoiceById(this.idInvoice).subscribe((invoiceFromDb) => {
        const leftToPay = invoiceFromDb.leftToPay;
        this.formModel.get('methodOfPaymentInput').setValue('Transfer');
        this.formModel.get('paidInput').setValue(leftToPay);
        this.formModel.get('dateOfPaymentInput')
          .setValue([formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')].pop());
      });
    } else {
      this.invoicesMap.checkOrInvoicesMapEqualsZero();
      this.invoicesMap.checkOrInvoicesMapIsMoreThanOne();
    }
  }

  savePayment() {
    const isSelectedOne = this.invoicesMap.checkOrInvoicesMapEqualsOne();
    if (isSelectedOne) {
      this.idInvoice = this.invoicesMap.getInvoiceIdFromMap();
      const currentPayment: Payment = {
        id: null,
        methodOfPayment: this.formModel.get('methodOfPaymentInput').value,
        paid: this.formModel.get('paidInput').value,
        dateOfPayment: this.formModel.get('dateOfPaymentInput').value,
      };
      if (this.mode === 'add') {
        this.paymentService.savePayment(currentPayment, this.idInvoice)
          .subscribe((paymentToSave) => {
            if (paymentToSave !== undefined) {
              this.isCreated = true;
            }
            if (this.isCreated) {
              this.closeDialog();
              this.addPaymentToInvoice.emit(this.idInvoice);
            }
          }, (response: HttpErrorResponse) => {
            this.validationErrors = response.error;
            this.isCreated = false;
            console.log(response.error['payment.paid']);
          });
      }
      if (this.mode === 'settle') {
        this.paymentService.settlePayment(currentPayment, this.idInvoice)
          .subscribe(paymentToSettle => {
            if (paymentToSettle !== undefined) {
              this.isCreated = true;
            }
            if (this.isCreated) {
              this.closeDialog();
              this.addPaymentToInvoice.emit(this.idInvoice);
            }
          }, (response: HttpErrorResponse) => {
            this.validationErrors = response.error;
            this.isCreated = false;
            console.log(response.error['payment.paid']);
          });
      } else {
        this.invoicesMap.checkOrInvoicesMapEqualsZero();
        this.invoicesMap.checkOrInvoicesMapIsMoreThanOne();
        this.settleIsHidden = true;
      }
    }
  }



  closeDialog()  {
    this.settleIsHidden = true;
    this.clearValidationErrors();
    this.clearPaymentForm();
    this.checkboxService.removeFromInvoicesMap(this.idInvoice);
    this.paymentsMap.refresh();
  }

  public clearPaymentForm() {
    this.formModel.get('methodOfPaymentInput').setValue('Transfer'),
     // console.log(this.myFormModel.get('methodOfPaymentInput').value);
    this.formModel.get('paidInput').setValue( parseInt('0,00'));
    this.formModel.get('dateOfPaymentInput').setValue('');
    //  [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')]);
  }

  private clearValidationErrors() {
    this.validationErrors = undefined;
  }



}
