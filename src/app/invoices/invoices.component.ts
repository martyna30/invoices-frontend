import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddInvoiceComponent} from './add-invoice/add-invoice.component';
import {FormGroup} from '@angular/forms';
import {InvoiceService} from '../services/invoice.service';
import {Observable} from 'rxjs';
import {CheckboxService} from '../services/checkbox.service';
import {DeleteInvoiceComponent} from './delete-invoice/delete-invoice.component';
import {Invoice} from '../models-interface/invoice';
import {PrintInvoiceComponent} from './print-invoice/print-invoice.component';
import {UserAuthService} from '../services/user-auth.service';
import {SettleInvoiceComponent} from './settle-invoice/settle-invoice/settle-invoice.component';
import {InvoicesMapComponent} from '../checkbox-component/invoices-map/invoices-map/invoices-map.component';

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  @ViewChild('childAddRef')
  addInvoiceComponent: AddInvoiceComponent;
  @ViewChild('childDeleteRef')
  deleteComponent: DeleteInvoiceComponent;
  @ViewChild('childPrintInvoice')
  printComponent: PrintInvoiceComponent;
  @ViewChild('childSettleComponentRef')
  settleComponent: SettleInvoiceComponent;
  @ViewChild('childInvoicesMap')
  invoiceMap: InvoicesMapComponent;
  isDisabled: false;
  page = 1;
  size = 10;
  total: Observable<number>;
  invoicesList$: Observable<Array<Invoice>>;
  checkboxOfInvoice: number;
  isHidden = true;
  settleInvoiceComponentIsHidden = true;
  paymentIsHidden = true;
  isloggedin: boolean;
  private invoiceIdFromMap: number;

  constructor(private dialog: MatDialog, private invoiceService: InvoiceService,
              private checkboxService: CheckboxService, private userService: UserAuthService) {
  }

  ngOnInit(): void {
    this.checkStatus();
    this.loadData();
  }

  checkStatus() {
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
      this.isHidden = false;
    }
  }

  getColor(): string {
    return 'blue';
  }

  openDialog(mode: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mode;
    dialogConfig.panelClass = 'custom-modalbox';
    if (mode === 'edit' || mode === 'add') {
      this.dialog.open(AddInvoiceComponent, dialogConfig);
    }
    if (mode === 'add') {
      this.addInvoiceComponent.showAddInvoiceForm();
    } else if (mode === 'edit') {
      this.addInvoiceComponent.showEditInvoiceForm();
    } else {
      dialogConfig.panelClass = 'settle-modalbox';
      this.dialog.open(SettleInvoiceComponent, dialogConfig);
      this.settleComponent.settlePayment();
      //[settleIsHidden]="settleInvoiceComponentIsHidden"
    }
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    console.log(this.page);
    this.loadData();
  }

  // tslint:disable-next-line:typedef
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

  // tslint:disable-next-line:typedef
  loadData() {
    const page = this.page - 1;
    this.invoiceService.getInvoicesListObservable(page, this.size);
    this.invoicesList$ = this.invoiceService.getInvoicesFromService();
    // @ts-ignore
    this.total = this.invoiceService.getTotalCountInvoices();
    if (this.checkboxService.lengthInvoicesMap() > 0) {
      this.invoiceIdFromMap = this.checkboxService.getInvoicesMap().keys().next().value;
      this.checkboxService.removeFromInvoicesMap(this.invoiceIdFromMap);
    }
  }

  // tslint:disable-next-line:typedef
  changeCheckboxList(checkboxOfInvoice: HTMLInputElement) {
    if (checkboxOfInvoice.checked) {
      this.checkboxOfInvoice = Number(checkboxOfInvoice.value);
      this.checkboxService.addToInvoicesMap(Number(this.checkboxOfInvoice));

    } else {
      this.checkboxService.removeFromInvoicesMap(Number(this.checkboxOfInvoice));
    }
  }

  deleteInvoice() {
    // if (this.token !== null && this.token !== undefined) {
    // if (this.userRole.toString() === 'ROLE_ADMIN') {
    this.deleteComponent.deleteInvoice();
  }

  // else {
  // alert('Function available only for the administrator');
  //  }
  // }else {
  // alert('Function available only for the administrator');
  // }
  settleInvoice() {

  }

  printInvoice() {
    this.printComponent.printInvoice();
  }


  /* toggleNamePlaceholder() {
     this.showNamePlaceholder = (this.myFormModel.get('nameInput').value === '');
   }

   checkTheChangeName() {
     this.myFormModel.get('nameInput').valueChanges.subscribe(
       response => this.searchObjectsWithSpecifiedTitleOrAuthor(response)
     );

   searchObjectsWithSpecifiedTitleOrAuthor(objectToSearch) {
     if (objectToSearch !== undefined && objectToSearch !== '') {
       this.objectService.getObjectsWithSpecifiedTitleOrAuthor(objectToSearch).subscribe(objectName => {
         // tslint:disable-next-line:no-shadowed-variable
         this.searchedObjectsName = objectName.map(objectName => objectName.name);
       });
     }
 */

}




