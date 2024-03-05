import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UserAuthService} from '../services/user-auth.service';
import {InvoiceService} from '../services/invoice.service';
import {Observable} from 'rxjs';
import {Invoice} from '../models-interface/invoice';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SellerComponent} from '../settings/seller/seller.component';
import {PaymentDetailsComponent} from './payment-details/payment-details/payment-details.component';
import {PaymentService} from '../services/payment.service';

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  paymentIsHidden = true;
  detailsIsHidden = true;
  isloggedin: boolean;
  page = 1;
  size = 10;
  total: Observable<number>;
  invoicesList$: Observable<Array<Invoice>>;
  @ViewChild('paymentChild')
  paymentDetailsComponent: PaymentDetailsComponent;
  invoiceId: number;
  isDisabled: false;
  private token: string;

  constructor(private userAuthService: UserAuthService,
              private invoiceService: InvoiceService,
              private dialog: MatDialog){}

  ngOnInit(): void {
    this.checkToken();
    this.checkStatus();
    this.loadData();

  }

  checkToken(): string {
    this.userAuthService.token$.subscribe((token) => {
      this.token = token;
    });
    return this.token;
  }

  checkStatus() {
    if (this.userAuthService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
      this.paymentIsHidden = false;
    }
  }



  showPayment() {
    this.paymentIsHidden = false;
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    console.log(this.page);
    this.loadData();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  loadPage(page: any) {
    console.log(page);
    if (page !== 1) {
      this.page = page;
      console.log(page);
      this.loadData();
    }
  }


  loadData() {
    const page = this.page - 1;
    this.invoiceService.getInvoicesListObservable(page, this.size);
    this.invoicesList$ = this.invoiceService.getInvoicesFromService();
    // @ts-ignore
    this.total = this.invoiceService.getTotalCountInvoices();
  }



     async openDialog(invoiceId) {
    this.invoiceId = invoiceId;
    // this.myFormModel.enable();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.data = mode;
    // tslint:disable-next-line:no-unused-expression
    /*dialogConfig.position = {
      top: '50px',
      bottom: '700px',
      left: '700px',
      right: '0px'
    },*/
    dialogConfig.panelClass = 'details-modalbox';
    if (this.token !== null && this.token !== undefined) {
    await this.paymentDetailsComponent.getPaymentsListForInvoice(invoiceId);
    } else {
      alert('Function available only for the logged-in user');
    }
  }
}



