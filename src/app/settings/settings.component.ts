import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InvoiceValidationError} from '../models-interface/invoiceValidationError';
import {ContractorValidationError} from '../models-interface/contractorValidationError';
import {AddressValidationError} from '../models-interface/addressValidationError';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ContractorsCatalogComponent} from '../contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import {SellerComponent} from './seller/seller.component';
import {SellerService} from '../services/seller.service';
import {UserAuthService} from '../services/user-auth.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {RegistrationComponent} from '../login-registration/registration/registration.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('childSellerDataRef')
  sellerComponent: SellerComponent;
  @Input()
  settingsComponentIsHidden;
  isloggedin: boolean;
  formModel: FormGroup;
  addressFormIsHidden = true;
  disabled = true;
  private mode: string;

  /*checkTheChangeAddressName() {
    this.myFormModel.get('addressInput').valueChanges.subscribe(
      response => this.showAddressForm(response)
    );
  }

  private showAddressForm(response) {
    if (this.addressFormIsHidden) {
      this.addressFormIsHidden = !this.addressFormIsHidden;
    }
  }*/


  constructor(private fb: FormBuilder, private dialog: MatDialog,
              private sellerService: SellerService,
              private userService: UserAuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.formModel = this.fb.group({
      nameInput: ({value: '', disabled: this.disabled}),
      addressInput: ({value: '', disabled: true}),
      vatIdentificationNumberInput: ({value: '', disabled: true}),
    });
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
      const username = this.userService.userName$.value;
      if (this.isloggedin) {
      this.sellerService.getSellerByAppUser(username).subscribe((sellerFromDatabase) => {
        if (sellerFromDatabase !== undefined) {
          this.formModel.get('nameInput').setValue(sellerFromDatabase.name);
          this.formModel.get('vatIdentificationNumberInput').setValue(sellerFromDatabase.vatIdentificationNumber);
          const street = sellerFromDatabase.address.street;
          const streetNumber = sellerFromDatabase.address.streetNumber;
          const postcode = sellerFromDatabase.address.postcode;
          const city = sellerFromDatabase.address.city;
          const country = sellerFromDatabase.address.country;
          const address = street + '' + streetNumber + ',' + postcode + '' + city;
          this.formModel.get('addressInput').setValue(address);
        }
      }, (response: HttpErrorResponse) => {
        if (response.status === 403 || response.status === 401) {
          this.router.navigate(['/settings']);
          alert('Complete data of the seller');
        }
      });
      }
    }
    else {
      this.isloggedin = false;
    }
  }


  openDialog(mode: string)  {
    // this.myFormModel.enable();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mode;
    // tslint:disable-next-line:no-unused-expression
    /*dialogConfig.position = {
      top: '50px',
      bottom: '700px',
      left: '700px',
      right: '0px'
    },*/
    dialogConfig.panelClass = 'seller-modalbox';
    this.dialog.open(SellerComponent, dialogConfig);
    if (mode === 'add') {
      this.sellerComponent.showSellerData();
    }
    /*if (mode === 'gus') {
      this.sellerComponent.showSellerFromGusData();
    }*/

    else {
      const name = this.formModel.get('nameInput').value;
      this.sellerComponent.showEditSellerData(name);
    }
  }

  // tslint:disable-next-line:typedef variable-name
  addSellerToTheSettings(vatIdentificationNumber: string) {
    this.sellerService.getSellerByVatIdentificationNumber(vatIdentificationNumber).subscribe((sellerFromDb) => {
      if (sellerFromDb !== undefined) {
        this.formModel.get('nameInput').setValue(sellerFromDb.name);
        this.formModel.get('vatIdentificationNumberInput').setValue(sellerFromDb.vatIdentificationNumber);
        const street = sellerFromDb.address.street;
        const streetNumber = sellerFromDb.address.streetNumber;
        const postcode = sellerFromDb.address.postcode;
        const city = sellerFromDb.address.city;
        const country = sellerFromDb.address.country;
        const address = street + '' + streetNumber + ',' + postcode + '' + city;
        this.formModel.get('addressInput').setValue(address);
      }
      else {
        alert('Complete data of the seller');
      }
    });
  }
  addSellerFromGusToTheSettings(vatIdentificationNumber: string) {
    this.settingsComponentIsHidden = false;
    this.sellerService.getSellerFromGus(vatIdentificationNumber).subscribe((sellerFromGus) => {
      if (sellerFromGus !== undefined) {
        this.formModel.get('nameInput').setValue(sellerFromGus.name);
        this.formModel.get('vatIdentificationNumberInput').setValue(sellerFromGus.vatIdentificationNumber);
        const street = sellerFromGus.address.street;
        const streetNumber = sellerFromGus.address.streetNumber;
        const postcode = sellerFromGus.address.postcode;
        const city = sellerFromGus.address.city;
        const address = street +  '' + streetNumber +  ',' + postcode +  '' + city;
        this.formModel.get('addressInput').setValue(address);
      }
      else {
        alert('Complete data of the seller');
      }
    });
  }

  // tslint:disable-next-line:typedef
  /*addContractorFromGusToTheSettings(vatIdentificationNumber: string) {
    this.sellerService.getContractorFromGusByNip(vatIdentificationNumber).subscribe((contractorFromGus) => {

    });*/


  save() {
    this.formModel.disable();
    if (!this.addressFormIsHidden) {
      this.addressFormIsHidden = true;
    }
  }


  /*getSellerFromGus(nip) {
    this.settingsComponentIsHidden = false;
    this.openDialog('gus');
    this.sellerComponent.getSellerFromGus(nip);
  }*/

}
