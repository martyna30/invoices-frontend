import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {InvoicesComponent} from './invoices/invoices.component';
import {AddInvoiceComponent} from './invoices/add-invoice/add-invoice.component';
import {DeleteInvoiceComponent} from './invoices/delete-invoice/delete-invoice.component';
import {Router} from '@angular/router';
import {UserAuthService} from './services/user-auth.service';
import {SellerService} from './services/seller.service';
import {Seller} from './models-interface/seller';
import {async, Observable} from 'rxjs';
import {SellerComponent} from './settings/seller/seller.component';
import {SettingsComponent} from './settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
// <app-login [loginFormIsHidden]="loginFormIsHidden" ></app-login>
  @ViewChild('childSettingsDataRef')
  settingsComponent: SettingsComponent;
  username$: Observable<string>;
  private username: string;
  currentSellerId;
  settingsIsHidden = true;
  timeoutId;
  isloggedin$: Observable<boolean>;
  isloggedin: boolean;
  token$: Observable<string>;
  private token: string;
  private timeoutId2;

  constructor(private userAuthService: UserAuthService,
              private sellerService: SellerService, private router: Router,
              private readonly changeDetectorRef: ChangeDetectorRef) {}


  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
    this.checkToken();
  }

  ngOnInit() {
    this.checkToken();
    //if (this.token !== undefined && this.token !== null) {
      //this.getUsername();
     // this.checkStatus();

  }




  checkStatus() {
    /*this.userAuthService.isloggedin$.subscribe(( isLoggedin) => {
      this.isloggedin = isLoggedin;
    });*/
    this.isloggedin$ = this.userAuthService.isloggedin$;
  }


  getUsername() {
    /*this.userAuthService.userName$.subscribe(username => {
      this.username = username;
    });*/
    this.username$ = this.userAuthService.userName$;
  }

  checkToken() {
    this.userAuthService.getTokenFromService().subscribe(
      token => {
        this.token = token;
        if (this.token !== undefined && this.token !== null) {
          this.checkStatus();
          this.getUsername();
        }
      });

  }



  logout() {
    this.userAuthService.logout();
    this.userAuthService.isloggedin$.next(false);
  }



}
