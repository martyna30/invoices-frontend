import {Component, OnInit, ViewChild} from '@angular/core';
import {InvoicesComponent} from './invoices/invoices.component';
import {AddInvoiceComponent} from './invoices/add-invoice/add-invoice.component';
import {DeleteInvoiceComponent} from './invoices/delete-invoice/delete-invoice.component';
import {Router} from '@angular/router';
import {UserAuthService} from './services/user-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
// <app-login [loginFormIsHidden]="loginFormIsHidden" ></app-login>
  private tokenFromService: string;
  username: string;
  isloggedin: boolean;
  loginFormIsHidden = true;
  registerFormIsHidden = true;
  settingsIsHidden = false;
  constructor(private userAuthService: UserAuthService, private router: Router) {}

  ngOnInit(): void {
    this.userAuthService.userName$.subscribe((username) => {
      this.username = username;
    });
    this.checkStatus();
    this.checkToken();
  }

  checkToken(): void {
    this.userAuthService.getTokenFromService().subscribe(token => {
      this.tokenFromService = token;
    });

    if (this.tokenFromService !== null && this.tokenFromService !== undefined) {
      this.isloggedin = true;
    }
    this.isloggedin = false;
    console.log('Access denied, you have to log in');
  }
  checkStatus() {
    this.userAuthService.isloggedin$.subscribe((isloggedin) => {
      this.isloggedin = isloggedin;
    });
  }

  logout() {
    this.userAuthService.logout();
    this.isloggedin = false;
    this.userAuthService.isloggedin$.next(false);
  }









}
