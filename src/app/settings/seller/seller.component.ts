import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContractorValidationError} from '../../models-interface/contractorValidationError';

import {FormBuilder, FormGroup} from '@angular/forms';
import {Contractor} from '../../models-interface/contractor';
import {HttpErrorResponse} from '@angular/common/http';
import {Seller} from '../../models-interface/seller';
import {SellerService} from '../../services/seller.service';
import {AddressValidationError} from '../../models-interface/addressValidationError';
import {ContractorDto} from '../../models-interface/contractorDto';
import {Address} from '../../models-interface/address';
import {SellerValidationError} from '../../models-interface/sellerValidationError';
import {UserAuthService} from '../../services/user-auth.service';
import {AppUser} from '../../models-interface/appUser';
import {map} from 'rxjs/operators';
import {ContractorService} from '../../services/contractor.service';
import {Router} from '@angular/router';



@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  @Input()
  isHidden: boolean;
  private mode: string;
  myFormModel: FormGroup;
  private isCreated: boolean;
  validationErrors: SellerValidationError;
  username: string;
  loggedinUser: AppUser;
  @Output()
  addSellerToTheSettings: EventEmitter<string> = new EventEmitter<string>();
  private sellerId: number;
  private sellerExist: boolean;
  @Output()
  settingsIsHidden: EventEmitter<boolean> = new EventEmitter<boolean>();




  constructor(private fb: FormBuilder, private sellerService: SellerService,
              private contractorService: ContractorService,
              private userService: UserAuthService,
              private router: Router) {
  }

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
    this.isHidden = true;
    /*if (this.userService.isloggedin$.getValue() === true) {
      this.userService.userName$.subscribe((username) => {
        this.username = username;
      });*/
    this.username = this.userService.getUsernameForLoggedInUser();
  }



  showSellerData() {
    this.mode = 'add';
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  showEditSellerData(name: string) {
    this.mode = 'edit';
    this.isHidden = false;
    this.sellerService.getSellerByName(name).subscribe((sellerFromDb) => {
      this.sellerId = sellerFromDb.id;
      this.myFormModel.get('nameInput').setValue(sellerFromDb.name);
      this.myFormModel.get('vatIdentificationNumberInput').setValue(sellerFromDb.vatIdentificationNumber);
      this.myFormModel.get('address').get('streetInput').setValue(sellerFromDb.address.street);
      this.myFormModel.get('address').get('streetNumberInput').setValue(sellerFromDb.address.streetNumber);
      this.myFormModel.get('address').get('postcodeInput').setValue(sellerFromDb.address.postcode);
      this.myFormModel.get('address').get('cityInput').setValue(sellerFromDb.address.city);
      this.myFormModel.get('address').get('countryInput').setValue(sellerFromDb.address.country);
    });
  }

  getSellerFromGus(nip: string) {
    this.mode = 'gus';
    this.isHidden = false;
    this.settingsIsHidden.emit(false);
    this.sellerService.getSellerFromGus(nip).subscribe((sellerFromGus) => {
      if (sellerFromGus !== undefined) {
        this.myFormModel.get('nameInput').setValue(sellerFromGus.name);
        this.myFormModel.get('vatIdentificationNumberInput').setValue(sellerFromGus.vatIdentificationNumber);
        this.myFormModel.get('address').get('streetInput').setValue(sellerFromGus.address.street);
        this.myFormModel.get('address').get('streetNumberInput').setValue(sellerFromGus.address.streetNumber);
        this.myFormModel.get('address').get('postcodeInput').setValue(sellerFromGus.address.postcode);
        this.myFormModel.get('address').get('cityInput').setValue(sellerFromGus.address.city);
        this.myFormModel.get('address').get('countryInput').setValue('Poland');
      }
    });

  }

  saveSeller() {
    if (this.mode === 'edit') {
      this.changeSeller();
    }
    else if (this.mode === 'gus') {
        this.saveSellerFromGus();
    } else {
      const seller: Seller = {
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
        },
        appUser: {
          id: null,
          username: this.username,
          password: null
        }
      };
      this.saveSellerToDatabase(seller);
      // if (response.status === 403 || response.status === 401) {
      // alert('Function available only for the administrator');

    }
  }

  private saveSellerFromGus() {
    const seller: Seller = {
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
      },
      appUser: {
        id: null,
        username: this.username,
        password: null
      }
    };
    this.saveSellerToDatabase(seller);
  }

  saveSellerToDatabase(seller) {
    this.sellerService.saveSeller(seller).subscribe(saveSeller => {
      if (saveSeller !== undefined) {
        this.isCreated = true;
        this.sellerExist = false;
      }
      if (this.isCreated) {
        this.addSellerToTheSettings.emit(seller.vatIdentificationNumber);
        this.closeDialog();
      }
    }, (response: HttpErrorResponse) => {
      this.validationErrors = response.error;
      console.log(response.error.name[0]);
      console.log(this.validationErrors.addressDto.postcode[0]);
      console.log(this.validationErrors);
    });
    this.isCreated = false;
  }

  changeSeller() {
    const seller: Seller = {
      id: this.sellerId,
      name: this.myFormModel.get('nameInput').value,
      vatIdentificationNumber: this.myFormModel.get('vatIdentificationNumberInput').value,
      address: {
        id: null,
        street: this.myFormModel.get('address').get('streetInput').value,
        streetNumber: this.myFormModel.get('address').get('streetNumberInput').value,
        postcode: this.myFormModel.get('address').get('postcodeInput').value,
        city: this.myFormModel.get('address').get('cityInput').value,
        country: this.myFormModel.get('address').get('countryInput').value
      },
      appUser: {
        id: null,
        username: this.loggedinUser.username,
        password: null
      }
    };
    this.sellerService.updateSeller(seller).subscribe(updateSeller => {
      if (updateSeller !== undefined) {
        this.isCreated = true;
        this.sellerExist = false;
      }
      if (this.isCreated) {
        this.addSellerToTheSettings.emit();
        this.closeDialog();
      }
    }, (response: HttpErrorResponse) => {
      this.validationErrors = response.error;
      this.isCreated = false;
      console.log(this.validationErrors);
    });
  }

  closeDialog() {
    this.isHidden = true;
    this.clearSellerForm();
    this.clearValidationErrors();
  }

  private clearSellerForm() {
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



}
