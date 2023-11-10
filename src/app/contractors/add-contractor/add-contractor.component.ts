import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Invoice} from '../../models-interface/invoice';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Contractor} from '../../models-interface/contractor';
import {ContractorValidationError} from '../../models-interface/contractorValidationError';
import {AddressValidationError} from '../../models-interface/addressValidationError';
import {ContractorDto} from '../../models-interface/contractorDto';
import {Address} from '../../models-interface/address';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {SellerService} from '../../services/seller.service';
import {ContractorService} from '../../services/contractor.service';
import {ProductService} from '../../services/product.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Item} from '../../models-interface/item';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-contractor',
  templateUrl: './add-contractor.component.html',
  styleUrls: ['./add-contractor.component.scss']
})
export class AddContractorComponent implements OnInit {
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  private subscriptions = new Subscription();
  @Input()
  invoicesList$: Observable<Array<Contractor>>;
  @Input()
  private checkboxOfInvoice: number;
  isHidden = true;
  isHiddenContractor = true;
  private mode: string;
  private contractorMode: string;
  myFormModel: FormGroup;
  addressValidationErrors: AddressValidationError;
  private checkedList: Map<number, number>;
  private idContractor: number;
  contractorFromDb: Contractor;
  contractorToModified: ContractorDto;
  private addressToModified: Address;
  private isCreated: boolean;
  private contractorExist: boolean;
  validationErrors: ContractorValidationError;
  private showNamePlaceholder: boolean;
  filteredName: any;


  constructor(private fb: FormBuilder, private checkboxservice: CheckboxService,
              private contractorService: ContractorService, private productService: ProductService) {}

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      nameInput: '',
      vatIdentificationNumberInput: '',
      address: this.fb.group({
        streetInput: '',
        streetNumberInput: '',
        postcodeInput: '',
        cityInput: '',
        countryInput: 'Poland'
      }),
    });
  }

  showAddContractorForm() {
    this.mode = 'add';
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  showEditContractorForm() {
    this.mode = 'edit';
    this.isHidden = false;
    this.checkedList = this.checkboxservice.getContractorsMap();
    if (this.checkboxservice.lengthContractorsMap() === 1) {
      this.idContractor = this.checkedList.keys().next().value;
      this.contractorService.getContractorById(this.idContractor).subscribe((contractorFromDb) => {
        this.contractorToModified = contractorFromDb;
        this.addressToModified = this.contractorToModified.address;
        this.myFormModel.get('nameInput').setValue(this.contractorToModified.name);
        this.myFormModel.get('vatIdentificationNumberInput').setValue(this.contractorToModified.vatIdentificationNumber);
        this.myFormModel.get('address').get('streetInput').setValue(this.addressToModified.street);
        this.myFormModel.get('address').get('streetNumberInput').setValue(this.addressToModified.streetNumber);
        this.myFormModel.get('address').get('postcodeInput').setValue(this.addressToModified.postcode);
        this.myFormModel.get('address').get('cityInput').setValue(this.addressToModified.city);
        this.myFormModel.get('address').get('countryInput').setValue(this.addressToModified.country);
      });
    }
    if (this.checkboxservice.lengthContractorsMap() === 0) {
      alert('Check the box');
      this.isHidden = true;
    }
    if (this.checkboxservice.lengthContractorsMap() > 1) {
      alert('More than one checkbox is selected, choose one');
      this.isHidden = true;
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    console.log('zostałem zniszczony');
  }



  getContractorFromGus(nip) {
    this.mode = 'gus';
    //this.isHidden = false;
    //this.settingsIsHidden.emit(false);
    this.contractorService.getContractorByNip(nip).subscribe((contractorFromGus) => {
      if (contractorFromGus !== undefined) {
        this.myFormModel.get('nameInput').setValue(contractorFromGus.name);
        this.myFormModel.get('vatIdentificationNumberInput').setValue(contractorFromGus.vatIdentificationNumber);
        this.myFormModel.get('address').get('streetInput').setValue(contractorFromGus.address.street);
        this.myFormModel.get('address').get('streetNumberInput').setValue(contractorFromGus.address.streetNumber);
        this.myFormModel.get('address').get('postcodeInput').setValue(contractorFromGus.address.postcode);
        this.myFormModel.get('address').get('cityInput').setValue(contractorFromGus.address.city);
        this.myFormModel.get('address').get('countryInput').setValue('Poland');
      }
    });
  }


  saveContractor() {
    if (this.mode === 'edit') {
      this.changeContractor();
    } else {
      // tslint:disable-next-line:one-variable-per-declaration
      const contractor: Contractor = {
        id: null,
        name: this.myFormModel.get('nameInput').value,
        vatIdentificationNumber: this.myFormModel.get('vatIdentificationNumberInput').value,
        address: {
            id: null,
            street: this.myFormModel.get('address').get('streetInput').value,
            streetNumber: this.myFormModel.get('address').get('streetNumberInput').value,
            postcode: this.myFormModel.get('address').get('postcodeInput').value,
            city: this.myFormModel.get('address').get('cityInput').value,
            country: this.myFormModel.get('address').get('countryInput').value
          }
      };
      this.contractorService.saveContractor(contractor).subscribe(saveContractor => {
        if (saveContractor !== undefined) {
          this.isCreated = true;
          this.contractorExist = false;
        }
        if (this.isCreated) {
          this.loadData.emit();
          this.closeDialog();
        }
      }, (response: HttpErrorResponse) => {
        this.validationErrors = response.error;
        //console.log(response.error.contractorDto.name[0]);
        console.log(this.validationErrors);
      });
      this.isCreated = false;
      // if (response.status === 403 || response.status === 401) {
      // alert('Function available only for the administrator');

    }
    // });
  }


  private changeContractor() {
    const contractor: Contractor = {
      id: this.idContractor,
      name: this.myFormModel.get('nameInput').value,
      vatIdentificationNumber: this.myFormModel.get('vatIdentificationNumberInput').value,
      address: {
        id: null,
        street: this.myFormModel.get('address').get('streetInput').value,
        streetNumber: this.myFormModel.get('address').get('streetNumberInput').value,
        postcode: this.myFormModel.get('address').get('postcodeInput').value,
        city: this.myFormModel.get('address').get('cityInput').value,
        country: this.myFormModel.get('address').get('countryInput').value
      }
    };
    this.contractorService.updateContractor(contractor).subscribe(updateContractor => {
      if (updateContractor !== undefined) {
        this.isCreated = true;
        this.contractorExist = false;
      }
      if (this.isCreated) {
        this.loadData.emit();
        this.closeDialog();
      }
    }, (response: HttpErrorResponse) => {
      this.validationErrors = response.error;
      this.isCreated = false;
      console.log(response.error.contractorDto.name[0]);
      console.log(this.validationErrors);
    });
  }

  closeDialog() {
    this.isHidden = true;
    this.clearContractorForm();
    this.clearValidationErrors();
    this.checkboxservice.removeFromContractorsMap(this.checkboxOfInvoice);
  }

  private clearContractorForm() {
    this.myFormModel.get('nameInput').setValue(''),
      this.myFormModel.get('vatIdentificationNumberInput').setValue(''),
      this.myFormModel.get('address').get('streetInput').setValue(''),
      this.myFormModel.get('address').get('streetNumberInput').setValue(''),
      this.myFormModel.get('address').get('postcodeInput').setValue(''),
      this.myFormModel.get('address').get('cityInput').setValue(''),
      this.myFormModel.get('address').get('countryInput').setValue('');
  }
  private clearValidationErrors() {
    this.validationErrors = undefined;
  }
  toggleNamePlaceholder() {
    this.showNamePlaceholder = (this.myFormModel.get('nameInput').value === '');
  }

}
