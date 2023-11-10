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



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: string;
  password: string;
  private isComming: boolean;
  @ViewChild('childRegistrationRef')
  registrationComponent: RegistrationComponent;
  registerFormIsHidden = true;
  @Output()
  addSellerToSettings: EventEmitter<any> = new EventEmitter<any>();
  myFormModel: FormGroup;
  loggingValidationError: LoggingValidationError;
  isloggedin: boolean;
  isRegister: boolean;

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
    this.registerFormIsHidden = true;

  }
  // tslint:disable-next-line:typedef


  public signIn(login: string){
    this.loginFormIsHidden = false;

    this.login = login;
    const userDto: UserDto = {
      username : this.myFormModel.get('loginInput').value,
      password: this.myFormModel.get('passwordInput').value
    };
    // @ts-ignore
    this.userAuthService.login(userDto).subscribe(
      (tokenIsComming) => {
        this.isComming = tokenIsComming;
        if (this.isComming) {
          this.loginFormIsHidden = true;
          this.isloggedin = true;
          this.router.navigate(['/']);
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
    //this.registerFormIsHidden = false;
    this.registrationComponent.showRegisterForm();
  }




}
