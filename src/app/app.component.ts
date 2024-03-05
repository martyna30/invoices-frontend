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
  currentSellerId;
  settingsIsHidden = true;
  isloggedin: boolean;
  timeoutId;
  isloggedin$: Observable<boolean>;
  private token: string;

  constructor(private userAuthService: UserAuthService,
              private sellerService: SellerService, private router: Router,
              private readonly changeDetectorRef: ChangeDetectorRef) {}


  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

     ngOnInit() {
      this.checkToken();
      if (this.token !== undefined && this.token !== null) {
        this.checkStatus();
        if (this.isloggedin$) {
          console.log(this.isloggedin$);
          this.getUsername();
        }
        //if (this.isloggedin$) {
         // this.getUsername();
       // }
      }
    }


  checkStatus() {
    this.isloggedin$ = this.userAuthService.isloggedin$;
  }


  getUsername() {
    this.username$ = this.userAuthService.userName$;
  }

  checkToken(): void {
    this.userAuthService.getTokenFromService().subscribe(token => {
      this.token = token;
    });
  }


  logout() {
    this.userAuthService.logout();
    this.userAuthService.isloggedin$.next(false);
  }



}
