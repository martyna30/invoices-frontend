import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {UserAuthService} from './services/user-auth.service';
import {async, Observable} from 'rxjs';
import {CheckStatusComponent} from './checkStatusComponent/check-status/check-status.component';
import {SellerComponent} from './settings/seller/seller.component';
import {LoginComponent} from './login-registration/login.component';
import {SellerService} from './services/seller.service';
import {Seller} from './models-interface/seller';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , AfterViewInit {
  @ViewChild('checkStatusDataRef')
  checkStatusComponent: CheckStatusComponent;
  isLoggedIn$: Observable<boolean>;
  username$: Observable<string>;
  seller$: Observable<Seller>;
  constructor(private userAuthService: UserAuthService,
              private sellerService: SellerService,
              private readonly changeDetectorRef: ChangeDetectorRef) {}



   ngOnInit() {
  }


  ngAfterViewInit(): void {
    this.checkStatusAndGetUsername();
    console.log('ngAfterViewOnInit');
  }

  checkStatusAndGetUsername() {
    this.isLoggedIn$ = this.checkStatusComponent.checkStatusObservable();
    this.username$ = this.userAuthService.getUsernameAsObervable();
  }



  logout() {
    this.userAuthService.logout();
    this.userAuthService.isloggedin$.next(false);
  }




}
