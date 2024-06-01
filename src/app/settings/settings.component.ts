import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SellerComponent} from './seller/seller.component';
import {SellerService} from '../services/seller.service';
import {UserAuthService} from '../services/user-auth.service';
import {Router} from '@angular/router';
import {Seller} from '../models-interface/seller';
import {async, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {PaymentComponent} from '../payment/payment.component';




@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('childSellerDataRef')
  sellerComponent: SellerComponent;
  @ViewChild('childRecordComponentRef')
  recordComponent: PaymentComponent;
  settingsComponentIsHidden = true;
  //@Input()
  settingsIsHidden: boolean;
  currentSeller: Observable<Seller>;
  addressSeller: Observable<void>;
  isloggedin: boolean;
  formModel: FormGroup;
  addressFormIsHidden = true;
  disabled = true;
  private mode: string;
  private timeoutId;
  private token: string;
  private showVatINPlaceholder: boolean;

  /*checkTheChangeAddressName() {
    this.myFormModel.get('addressInput').valueChanges.subscribe(
      response => this.showAddressForm(response)
    );
  }

  private showAddressForm(response) {
    if (this.addressFormIsHidden) {
      this.addressFormIsHidden = !this.addressFormIsHidden;
    }
     // {(currentSeller | async)?.vatIdentificationNumber}}
  }*/

  constructor(private fb: FormBuilder, private dialog: MatDialog,
              private sellerService: SellerService,
              private userAuthService: UserAuthService,
              private router: Router) {
  }



  async ngOnInit() {
    this.formModel = this.fb.group({
      nameInput: ({value: '', disabled: this.disabled}),
      addressInput: ({value: '', disabled: true}),
      vatIdentificationNumberInput: ({value: '', disabled: true}),
    });
    this.checkToken();
    this.isloggedin = this.checkStatus();
    if (this.token !== undefined && this.token !== null) {
      if (this.isloggedin) {
        this.settingsComponentIsHidden = false;
        const username = this.getUsername();
        const currentSeller = localStorage.getItem('currentSeller');
        this.userAuthService.getSellerData(currentSeller, username);
        this.getSellerFromService();
        /*if (currentSeller !== undefined && currentSeller !== null) {
          this.getSellerFromService();
        }else {
          await this.getSeller(username, 200);
          this.getSellerFromService();
        }*/
      }
    }

  }


  checkToken(): string {
    this.userAuthService.token$.subscribe((token) => {
      this.token = token;
    });
    return this.token;
  }
  checkStatus(): boolean {
    if (this.userAuthService.isloggedin$.getValue() === true) {
      return true;
    } else {
      return false;
    }
  }


  getUsername(): string {
    return this.userAuthService.userName$.value;
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    console.log('Timeout has been removed');
  }

    getSeller(username, timeout) {
    return new Promise((resolve, reject) => {
     this.sellerService.getSellerByAppUser(username);
     this.timeoutId = setTimeout( resolve, timeout);
     });
    }

   // if (response.status === 403 || response.status === 401) {
  //alert('Complete data of the seller');
  //}
  // });// if (timeoutId) {// clearTimeout(timeoutId);
  //});



  getSellerFromService() {
    this.sellerService.getSellerByAppUserFromService().subscribe( seller => {
    // this.currentSeller.pipe(map(seller => {
      if (seller !== undefined && seller !== null) {
        const street = seller.address.street;
        const streetNumber = seller.address.streetNumber;
        const postcode = seller.address.postcode;
        const city = seller.address.city;
        const address = street + ' ' + streetNumber + ', ' + '\n'
          + postcode + '' + city;
        this.formModel.get('addressInput').setValue(address);
        this.formModel.get('nameInput').setValue(seller.name);
        this.formModel.get('vatIdentificationNumberInput').setValue(seller.vatIdentificationNumber);
      } else  {
        alert('Complete data of the seller');
        //throw new Error('Complete data of the seller');
      }
    });
  }


  openDialog(mode: string) {
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
    if (this.token !== null && this.token !== undefined) {
      this.dialog.open(SellerComponent, dialogConfig);
      if (mode === 'add') {
          this.sellerComponent.showSellerData();
      } else {
        const name = this.formModel.get('nameInput').value;
        this.sellerComponent.showEditSellerData(name);
      }
    } else {
      alert('Function available only for the logged-in user');
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


  toggleVatIdentificationNumberPlaceholder() {
    this.showVatINPlaceholder = (this.formModel.get('vatIdentificationNumberInput').value === '');
   // this.showVatINPlaceholder = (this.formModel.get('vatIdentificationNumberInput').disabled === false) &&
      //(this.formModel.get('vatIdentificationNumberInput').value === '');
  }


}
