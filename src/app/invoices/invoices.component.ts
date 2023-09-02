import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddInvoiceComponent} from './add-invoice/add-invoice.component';
import {FormGroup} from '@angular/forms';
import {InvoiceService} from '../services/invoice.service';
import {Observable} from 'rxjs';
import {CheckboxService} from '../services/checkbox.service';
import {DeleteInvoiceComponent} from './delete-invoice/delete-invoice.component';
import {Invoice} from '../models-interface/invoice';

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

  isDisabled: false;

  page = 1;
  size = 10;
  total: Observable<number>;

  invoicesList$: Observable<Array<Invoice>>;

  checkboxOfInvoice: number;
  private isHidden: boolean;

  constructor(private dialog: MatDialog, private invoiceService: InvoiceService,
              private checkboxService: CheckboxService) {
  }

  ngOnInit(): void {
    this.loadData();
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
    this.dialog.open(AddInvoiceComponent, dialogConfig);
    if (mode === 'edit') {
      this.addInvoiceComponent.showEditInvoiceForm();
    } else {
      this.addInvoiceComponent.showAddInvoiceForm();
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
    const page = this.page - 1 ;
    this.invoiceService.getInvoicesListObservable(page, this.size);
    this.invoicesList$ = this.invoiceService.getInvoicesFromService();
    // @ts-ignore
    this.total = this.invoiceService.getTotalCountInvoices();
    if (this.checkboxService.lengthInvoicesMap() > 0) {
      this.checkboxService.removeFromInvoicesMap(this.checkboxOfInvoice);
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
  }*/

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







}





