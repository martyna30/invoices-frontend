import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SellerComponent} from './seller/seller.component';
import {SellerService} from '../services/seller.service';
import {UserAuthService} from '../services/user-auth.service';
import {Router} from '@angular/router';
import {Seller} from '../models-interface/seller';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Address} from '../models-interface/address';




@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('childSellerDataRef')
  sellerComponent: SellerComponent;
  @Input()
  settingsComponentIsHidden;
  currentSeller: Observable<Seller>;
  addressSeller: Observable<void>;
  isloggedin: boolean;
  formModel: FormGroup;
  addressFormIsHidden = true;
  disabled = true;
  private mode: string;
  private timeoutId;
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

 async ngOnInit() {
    this.formModel = this.fb.group({
      nameInput: ({value: '', disabled: this.disabled}),
      addressInput: ({value: '', disabled: true}),
      vatIdentificationNumberInput: ({value: '', disabled: true}),
    });
    if (this.userService.isloggedin$.getValue() === true) {
      this.isloggedin = true;
      const username = this.userService.userName$.value;
      // tslint:disable-next-line:typedef

      await this.getSeller(username, 200);
      this.getSellerFromService();
     // console.log( this.currentSeller + seller);
      // this.currentSeller = this.sellerService.getSellerByAppUserFromService();
      // this.sellerService.getSellerByAppUser(username);
      // this.currentSeller = this.sellerService.getSellerByAppUserFromService();
      // const currentSeller = await this.sellerService.getSellerByAppUserFromService().toPromise();

        // setInterval(() => observer.next(new Date().toString()), 1000);
      // .subscribe((sellerFromDatabase) => {
     // this.formModel.get('nameInput').setValue(this.currentSeller.pipe(map( s => s.name)));
      // this.formModel.get('vatIdentificationNumberInput').setValue(this.currentSeller.vatIdentificationNumber);
         // const street = sellerFromDatabase.address.street;
        // const streetNumber = sellerFromDatabase.address.streetNumber;
        // const postcode = sellerFromDatabase.address.postcode;
         // const city = sellerFromDatabase.address.city;
        // const address = street + '' + streetNumber + ',' + postcode + '' + city;
        // this.formModel.get('addressInput').setValue(address);
       // });
      // tslint:disable-next-line:align// , //(response: HttpErrorResponse) => {
       // if (response.status === 403 || response.status === 401) {
       //  this.router.navigate(['/settings']);
        // alert('Complete data of the seller');
       // }
     // );
     // } catch (err) {
     // }
    }
  }

  getSeller(username, timeout) {
    return new Promise(resolve => {
      this.sellerService.getSellerByAppUser(username);
      this.timeoutId = setTimeout(() => {
        resolve('Hello, world!');
      }, timeout);
      // if (timeoutId) {
       // clearTimeout(timeoutId);
     // }
    });
  }


  getSellerFromService() {
    this.currentSeller = this.sellerService.getSellerByAppUserFromService();
    this.addressSeller = this.currentSeller.pipe(map(seller => {
      const street = seller.address.street;
      const streetNumber = seller.address.streetNumber;
      const postcode = seller.address.postcode;
      const city = seller.address.city;
        // tslint:disable-next-line:no-unused-expression
      const address = street + ' ' + streetNumber + ', '  + '< br/>'
        + postcode + '' + city;
      this.formModel.get('addressInput').setValue(address);
      },
      (response: HttpErrorResponse) => {
        // if (response.status === 403 || response.status === 401) {
        //   this.router.navigate(['/settings']);
        //  alert('Complete data of the seller');
        // }
        // });
      }));
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

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    console.log('Timeout has been removed');
  }


  /*getSellerFromGus(nip) {
    this.settingsComponentIsHidden = false;
    this.openDialog('gus');
    this.sellerComponent.getSellerFromGus(nip);
  }*/


}
