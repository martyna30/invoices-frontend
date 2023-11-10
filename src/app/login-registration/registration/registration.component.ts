import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoggingValidationError} from '../../models-interface/loggingValidationError';
import {UserAuthService} from '../../services/user-auth.service';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {UserDto} from '../../models-interface/userDto';
import {HttpErrorResponse} from '@angular/common/http';
import {NewUserDto} from '../../models-interface/newUserDto';
import {SellerService} from '../../services/seller.service';
import {SettingsComponent} from '../../settings/settings.component';
import {SellerComponent} from '../../settings/seller/seller.component';
import {ContractorService} from '../../services/contractor.service';
import {error} from 'protractor';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @Input()
  registerFormIsHidden: boolean;
  sellerComponentIsHidden = true;
  @ViewChild('childSellerRef')
  sellerComponent: SellerComponent;
  @Output()
  loginFormIsHidden: EventEmitter<boolean> = new EventEmitter<boolean>();
  myFormModel: FormGroup;
  loggingValidationError: LoggingValidationError;
  isRegister: boolean;
  login: string;
  password: string;
  settingsComponentIsHidden = true;

  constructor(private fb: FormBuilder, private userAuthService: UserAuthService, private contractorService: ContractorService,
              private http: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      loginInput: '',
      passwordInput: '',
      emailInput: '',
      nipInput: '',
    });
    this.sellerComponentIsHidden = true;
  }

  showRegisterForm() {
    this.registerFormIsHidden = false;
  }

  register() {
    const newuser: NewUserDto = {
      username: this.myFormModel.get('loginInput').value,
      password: this.myFormModel.get('passwordInput').value,
      email: this.myFormModel.get('emailInput').value,
      nip: this.myFormModel.get('nipInput').value
    };
    const nip = this.myFormModel.get('nipInput').value;
    this.userAuthService.register(newuser).subscribe(responseFromDB => {
      const response = responseFromDB;
      console.log(response);
      if (response !== undefined) {
        this.isRegister = true;
      }
    }, (response: HttpErrorResponse) => {
      this.loggingValidationError = response.error;
      this.isRegister = false;
      if (response.status === 200 || response.status === 201) {
        this.isRegister = true;
      }
      if (response.status === 422 && this.loggingValidationError.email.includes('User with such an e-mail already exists')) {
        alert('User with such an e-mail has been registered, please log in if you already have a profile');
      }
      // tslint:disable-next-line:align
      if (this.isRegister) {
        alert('To complete your registration, click on the link in the email that we have just sent you.,' +
          'After the registration, you can sign in');
        this.registerFormIsHidden = true;
        console.log(this.isRegister);
        if (nip !== null && nip !== undefined) {
          this.openSellerComponent(nip);
        }
      }
    });
  }



 openSellerComponent(nip) {
    this.registerFormIsHidden = true;
    this.loginFormIsHidden.emit(false);
    this.sellerComponent.getSellerFromGus(nip);
  }

}


