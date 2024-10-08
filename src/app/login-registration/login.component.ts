import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {NewUserDto} from '../models-interface/newUserDto';
import {UserDto} from '../models-interface/userDto';
import {HttpService} from '../services/http.service';
import {Router} from '@angular/router';
import {Token} from '@angular/compiler';
import {LoggingValidationError} from '../models-interface/loggingValidationError';
import {UserAuthService} from '../services/user-auth.service';
import {Component, Injectable, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {SellerService} from '../services/seller.service';
import {AddInvoiceComponent} from '../invoices/add-invoice/add-invoice.component';
import {RegistrationComponent} from './registration/registration.component';
import {SellerComponent} from '../settings/seller/seller.component';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input()
  nip!: string;
  @Output()
  registrationFormIsHidden: EventEmitter<boolean> = new EventEmitter<boolean>();
  sellerComponentIsHidden = true;
  login: string;
  password: string;
  private isComming: boolean;
  @ViewChild('childSellerRef')
  sellerComponent: SellerComponent;
  @Output()
  addSellerToSettings: EventEmitter<any> = new EventEmitter<any>();
  myFormModel: FormGroup;
  loggingValidationError: LoggingValidationError;
  isloggedin: boolean;
  isRegister: boolean;
  private mode: string;
  loginFormIsHidden = true;



  constructor(private fb: FormBuilder, private userAuthService: UserAuthService,
              private http: HttpService, private router: Router) {
  }


  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      loginInput: '',
      passwordInput: '',
      emailInput: '',
      nipInput: '',
    });
    this.loginFormIsHidden = !this.loginFormIsHidden;
  }

  public signIn(login: string) {
    this.loginFormIsHidden = !this.loginFormIsHidden;

    this.login = login;
    const userDto: UserDto = {
      username : this.myFormModel.get('loginInput').value,
      password: this.myFormModel.get('passwordInput').value
    };
    // @ts-ignore
    this.userAuthService.login(userDto).subscribe(
      (tokenIsComming: boolean) => {
        this.isComming = tokenIsComming;
        if (this.isComming) {
          this.loginFormIsHidden = true;
          this.isloggedin = true;
          if (this.mode === 'first') {
            this.openSellerComponent();
          }
        }
      }, (response: HttpErrorResponse) => {
        console.log(response.error);
        this.loggingValidationError = response.error;
        this.isloggedin = false;

      });
    // this.token = this.userAuthService.getTokenFromService();
    // console.log(this.token);
    // if (this.token !== null) {
  }

  registerNewUser() {
    this.loginFormIsHidden = true;
    //this.registrationComponent.showRegisterForm();
  }


  showLoginFormForFirstLogin(nip: string) {
      console.log(nip);
      this.mode = 'first';
      this.loginFormIsHidden = !this.loginFormIsHidden;
  }

  openSellerComponent() {
    this.registrationFormIsHidden.emit(true);
    this.sellerComponent.getSellerFromGus(this.nip);
  }

}
