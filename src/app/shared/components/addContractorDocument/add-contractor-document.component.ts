import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { CheckboxService } from 'src/app/services/checkbox.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {InvoiceValidationError} from '../../../models-interface/invoiceValidationError';
import {ContractorsCatalogComponent} from '../../../contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import {GusContractorComponent} from '../../../contractors/add-contractor/gus-contractor/gus-contractor/gus-contractor.component';
import {ContractorFromGusDto} from '../../../models-interface/contractorFromGusDto';
import {ContractorService} from '../../../services/contractor.service';
import {Contractor} from '../../../models-interface/contractor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@Component({
  selector: 'app-add-contractor-document',
  templateUrl: './add-contractor-document.component.html',
  styleUrls: ['./add-contractor-document.component.scss']
})
export class AddContractorDocumentComponent implements OnInit {
  filteredName: [];
  validationErrors: InvoiceValidationError;
  contractor: FormGroup;
  @Output()
  saveInvoiceWithContractor: EventEmitter<any> = new EventEmitter<boolean>();
  @Input()
  contractorFormIsHidden = true;
  @Output()
  contractorIsHidden: EventEmitter<any> = new EventEmitter<boolean>();
  @Output()
  isCloseButtonHidden: EventEmitter<any> = new EventEmitter<boolean>();
  contractors: Array<Contractor>;
  contractorFromGus: GusContractorComponent;
  contractorCatalog: ContractorsCatalogComponent;
  //contractorIsHidden: boolean;
  //private showNamePlaceholder: boolean;
  //private showVATPlaceholder: boolean;
  //private numberOfItem: number;
  //private mode: string;




  constructor(private fb: FormBuilder, private checkboxservice: CheckboxService,
              private dialog: MatDialog,
              private contractorService: ContractorService) { }

  ngOnInit(): void {
    this.contractor = this.fb.group({
        nameInput: '',
        contractorSelect: '',
        vatIdentificationNumberInput: '',
        address: this.fb.group({
          streetInput: '',
          streetNumberInput: '',
          postcodeInput: '',
          cityInput: '',
          countryInput: 'Poland'

        })
      });
    this.checkTheChangeContractorName();
  }


  deleteDateFromForm() {
    this.clearContractorForm();
    if (!this.contractorFormIsHidden) {
      this.contractorIsHidden.emit(true);
    }
    if (!this.isCloseButtonHidden) {
      this.isCloseButtonHidden.emit(true);
    }
  }


  clearContractorForm() {
    this.contractor.get('nameInput').setValue('');
      // this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(''),
      /*this.myFormModel.get('contractor').get('address').get('streetInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('cityInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('countryInput').setValue('');
    */
  }

  openDialog(mode: string) {
    // this.numberOfItem = numberOfItem;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'contractors-modalbox';
    const gusDialogConfig = new MatDialogConfig();
    gusDialogConfig.disableClose = true;
    gusDialogConfig.autoFocus = true;
    gusDialogConfig.panelClass = 'gus-modalbox';
    /*gusDialogConfig.position = {
      top: '0px',
      bottom: '150px',
      left: '1200px',
      right: '1000px'
    };*/
    if (mode === 'catalogOfContractors') {
      this.dialog.open(ContractorsCatalogComponent, dialogConfig);
      this.contractorCatalog.showContractorCatalog();
    }
    if (mode === 'gus') {
      this.dialog.open(GusContractorComponent, gusDialogConfig);
      this.contractorFromGus.showContractorForm();
    }
    //<app-gus-contractor (addContractorFromTheGus)="addContractorFromTheGus($event)"   [gusFormIsHidden]="contractorFromGusIsHidden" ></app-gus-contractor>

  }

  savingChanges(contractorInput: HTMLInputElement) {
    if (contractorInput.checked) {
      // tslint:disable-next-line:no-unused-expression
     this.saveInvoiceWithContractor.emit(true);
    } else {
      this.saveInvoiceWithContractor.emit(false);
    }
  }

  checkTheChangeContractorName() {
    this.contractor.get('nameInput').valueChanges.subscribe(
      response => this.filterContractor(response)
    );
  }


  private filterContractor(response) {
    this.contractorService.getBuyerWithSpecifiedName(response).subscribe(contractors => {
      // tslint:disable-next-line:no-shadowed-variable
      this.filteredName = contractors.map(buyer => buyer.name);
      this.contractors = contractors;
    });
    if (this.contractorFormIsHidden) {
      // this.contractorIsHidden = !this.contractorIsHidden;
      this.contractorIsHidden.emit(false);
    }
    const name = this.contractor.get('nameInput').value;
    if (this.filteredName.find(e => e === name)) {
      if (this.isCloseButtonHidden) {
        this.isCloseButtonHidden.emit(false);
      }
      const contractorWithName = this.contractors.filter(contractor => contractor.name === name).pop();
      this.contractor.get('vatIdentificationNumberInput').setValue(contractorWithName.vatIdentificationNumber);
      this.contractor.get('address').get('streetInput').setValue(contractorWithName.address.street);
      this.contractor.get('address').get('streetNumberInput').setValue(contractorWithName.address.streetNumber);
      this.contractor.get('address').get('postcodeInput').setValue(contractorWithName.address.postcode);
      this.contractor.get('address').get('cityInput').setValue(contractorWithName.address.city);
      this.contractor.get('address').get('countryInput').setValue(contractorWithName.address.country);
    } else {
      //this.contractorFormIsHidden.emit(true);
    }
  }

  /*toggleNamePlaceholder() {
  this.showNamePlaceholder = (this.contractor.get('nameInput').value === '');
}

toggleVATPlaceholder() {
  this.showVATPlaceholder = (this.contractor.get('vatIdentificationNumberInput').value === '');
}*/


}
