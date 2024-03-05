import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

@Component({
  selector: 'app-settle-invoice',
  templateUrl: './settle-invoice.component.html',
  styleUrls: ['./settle-invoice.component.scss']
})
export class SettleInvoiceComponent implements OnInit {
  myFormModel: FormGroup;
  @Output()
  addPaymentToInvoice = new EventEmitter<string>();
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
  private invoiceToSettle: Invoice;
  private isCreated: boolean;


  constructor(private fb: FormBuilder, private userService: UserAuthService,
              private checkboxService: CheckboxService,
              private invoiceService: InvoiceService,
              private paymentService: PaymentService) {
  }

  ngOnInit(): void {
    this.formModel = this.fb.group({
      methodOfPaymentInput: '',
      paidInput: '',
      dateOfPaymentInput: ''
    });
    this.checkStatus();
  }

  checkStatus() {
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
    }
  }


  addPaymentForInvoice() {
    this.settleIsHidden = false;
    this.checkedList = this.checkboxService.getInvoicesMap();
    if (this.checkboxService.lengthInvoicesMap() === 1) {
      this.idInvoice = this.checkedList.keys().next().value;
    }
  }

  savePayment() {
    const currentPayment: Payment = {
      id: null,
      methodOfPayment: this.formModel.get('methodOfPaymentInput').value,
      paid: this.formModel.get('paidInput').value,
      dateOfPayment: this.formModel.get('dateOfPaymentInput').value,
    };
    this.paymentService.savePayment(currentPayment, this.idInvoice).subscribe((paymentToSave) => {
      if (paymentToSave !== undefined && paymentToSave !== null) {
        this.isCreated = true;
      }
      if (this.isCreated) {
        this.addPaymentToInvoice.emit(this.idInvoice.toString());
        this.closeDialog();
      }
    }, (response: HttpErrorResponse) => {
      this.validationErrors = response.error;
      this.isCreated = false;
    });
  }

  /*this.invoiceService.settleInvoice(this.invoiceToSettle).subscribe(updateInvoice => {
    if (updateInvoice !== undefined) {
      console.log(updateInvoice);
      this.isCreated = true;
      if (this.isCreated) {
        this.addPayment.emit(this.currentPayment);
        this.closeDialog();
      }
    }
  }, (response: HttpErrorResponse) => {
    this.validationErrors = response.error;
    this.isCreated = false;
  }
);
}

  /*if (response.status === 403 || response.status === 401) {
alert('Function available only for the administrator');
}*/
  //this.paymentService.savePayment(payment).subscribe((paymentToSave) => {
  /*if (paymentToSave !== undefined && paymentToSave !== null) {
    this.currentPayment = paymentToSave;
    this.isCreated = true;
  }
  if (this.isCreated) {
    this.addPaymentToInvoice.emit(this.currentPayment);
    //this.closeDialog();
  }
}, (response: HttpErrorResponse) => {
  this.validationErrors = response.error;
  this.isCreated = false;
  });*/

  /*this.invoiceService.settleInvoice(this.invoiceToSettle).subscribe(updateInvoice => {
    if (updateInvoice !== undefined) {
     this.isCreated = true;
    }
    if (this.isCreated) {
    this.addPaymentToInvoice.emit(this.currentPayment);
    this.closeDialog();
    }
  }, (response: HttpErrorResponse) => {
 this.validationErrors = response.error;
 this.isCreated = false;
 /* if (response.status === 403 || response.status === 401) {
    alert('Function available only for the administrator');
  }*/

  closeDialog(): void {
    this.settleIsHidden = true;
    this.clearPaymentForm();
    this.clearValidationErrors();
    // this.checkboxservice.removeFromInvoicesMap(this.checkboxOfInvoice);
  }

  private clearValidationErrors() {
    this.validationErrors = undefined;
  }

  private clearPaymentForm() {
  }

  // tslint:disable-next-line:typedef
}
