import {Component, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {UserAuthService} from '../services/user-auth.service';
import {InvoiceService} from '../services/invoice.service';
import {Observable} from 'rxjs';
import {Invoice} from '../models-interface/invoice';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {SellerComponent} from '../settings/seller/seller.component';
import {PaymentDetailsComponent} from './payment-details/payment-details/payment-details.component';
import {PaymentService} from '../services/payment.service';
import {CheckboxService} from '../services/checkbox.service';
import {InvoicesMapComponent} from '../checkbox-component/invoices-map/invoices-map/invoices-map.component';
import {InvoicesComponent} from '../invoices/invoices.component';


const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  detailsIsHidden = true;
  isloggedin: boolean;
  page = 1;
  size = 10;
  total: Observable<number>;
  invoicesList$: Observable<Array<Invoice>>;
  @ViewChild('paymentChild')
  paymentDetailsComponent: PaymentDetailsComponent;
  @ViewChild('childInvoicesMap')
  invoiceMap: InvoicesMapComponent;
  invoiceId: number;
  isDisabled: false;
  private token: string;
  paymentIsHidden = true;

  constructor(private userAuthService: UserAuthService,
              private invoiceService: InvoiceService,
              private checkboxService: CheckboxService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<PaymentDetailsComponent>,
              ){}




   ngOnInit() {
    this.checkToken();
    if (this.token !== null && this.token !== undefined) {
      this.checkStatus();
    }
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
      if (this.isloggedin) {
        this.loadInvoices();
        //this.invoicesComponent.loadData();
      }
    }
  }


  showPayment() {
    this.paymentIsHidden = false;
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    console.log(this.page);
    this.loadInvoices();
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  loadPage(page: any) {
    console.log(page);
    if (page !== 1) {
      this.page = page;
      console.log(page);
      this.loadInvoices();
    }
  }


  loadInvoices() {
    const page = this.page - 1;
    this.invoiceService.getInvoicesListObservable(page, this.size);
    this.invoicesList$ = this.invoiceService.getInvoicesFromService();
    // @ts-ignore
    this.total = this.invoiceService.getTotalCountInvoices();
   // if (this.checkboxService.lengthInvoicesMap() > 0) {
      //const invoiceid = this.invoiceMap.getInvoiceIdFromMap();
      //this.checkboxService.removeFromInvoicesMap(this.invoiceid);
      //this.changeInvoiceMap(this)
  }


  changeInvoiceMap(currentInvoiceid: number) {
    this.invoiceId = currentInvoiceid;
    if (this.checkboxService.getInvoicesMap().size > 0) {
      const invoiceId = this.invoiceMap.getInvoiceIdFromMap();
      this.checkboxService.removeFromInvoicesMap(invoiceId);
    }
    this.checkboxService.addToInvoicesMap(currentInvoiceid);
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
      const dialogRef = this.dialog.open(PaymentDetailsComponent, dialogConfig);
      //dialogRef.afterClosed().subscribe(result => {
       // console.log(result);
       // this.checkboxService.removeFromInvoicesMap(this.invoiceId);
     // });
    } else {
      alert('Function available only for the logged-in user');
    }
  }
  getColor(): string {
    return 'blue';
  }





}



