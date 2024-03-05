import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {InvoiceService} from '../services/invoice.service';
import {CheckboxService} from '../services/checkbox.service';
import {ContractorService} from '../services/contractor.service';
import {AddInvoiceComponent} from '../invoices/add-invoice/add-invoice.component';
import {DeleteInvoiceComponent} from '../invoices/delete-invoice/delete-invoice.component';
import {Observable} from 'rxjs';
import {Invoice} from '../models-interface/invoice';
import {AddContractorComponent} from './add-contractor/add-contractor.component';
import {DeleteContractorComponent} from './delete-contractor/delete-contractor.component';
import {Contractor} from '../models-interface/contractor';
import {UserAuthService} from '../services/user-auth.service';

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss']
})
export class ContractorsComponent implements OnInit {
  @ViewChild('childAddRef')
  addContractorComponent: AddContractorComponent;
  @ViewChild('childDeleteRef')
  deleteComponent: DeleteContractorComponent;
  isHidden = true;
  isDisabled: false;
  isloggedin: boolean;
  page = 1;
  size = 10;
  total: Observable<number>;
  contractorsList$: Observable<Array<Contractor>>;
  checkboxOfContractor: number;

  constructor(private dialog: MatDialog, private contractorService: ContractorService,
              private checkboxService: CheckboxService, private userService: UserAuthService) { }

  ngOnInit(): void {
    this.loadData();
    this.checkStatus();
  }

  private showContractorsComponent() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }
  checkStatus() {
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
      this.isHidden = false;
    }
  }

  getColor() {
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
      this.addContractorComponent.showEditContractorForm();
    } else {
      this.addContractorComponent.showAddContractorForm();
    }
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
    this.contractorService.getContractorsListObservable(page, this.size);
    this.contractorsList$ = this.contractorService.getContractorsFromService();
    // @ts-ignore
    this.total = this.contractorService.getTotalCountContractors();
    if (this.checkboxService.lengthContractorsMap() > 0) {
      this.checkboxService.removeFromContractorsMap(this.checkboxOfContractor);
    }
  }

  changeCheckboxList(checkboxOfContractor: HTMLInputElement) {
    if (checkboxOfContractor.checked) {
      this.checkboxOfContractor = Number(checkboxOfContractor.value);
      this.checkboxService.addToContractorsMap(Number(this.checkboxOfContractor));

    } else {
      this.checkboxService.removeFromContractorsMap(Number(this.checkboxOfContractor));
    }
  }

  deleteContractor() {
    // if (this.token !== null && this.token !== undefined) {
    // if (this.userRole.toString() === 'ROLE_ADMIN') {
    this.deleteComponent.deleteContractor();
  }



}
