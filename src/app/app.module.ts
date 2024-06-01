import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AddInvoiceComponent } from './invoices/add-invoice/add-invoice.component';
import {AppRoutingModule} from './app-routing.module';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpService} from './services/http.service';
import {InvoiceService} from './services/invoice.service';
import {CheckboxService} from './services/checkbox.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, DatePipe, DecimalPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DeleteInvoiceComponent} from './invoices/delete-invoice/delete-invoice.component';
import {ProductService} from './services/product.service';
import {SellerService} from './services/seller.service';
import {ContractorService} from './services/contractor.service';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import { DatePipeComponent } from './pipe/date.pipe/date-pipe/date-pipe.component';
import {formatDate} from '@angular/common';
import { AddContractorComponent } from './contractors/add-contractor/add-contractor.component';
import { ContractorsComponent } from './contractors/contractors.component';
import { DeleteContractorComponent } from './contractors/delete-contractor/delete-contractor.component';
import {_MatMenuDirectivesModule, MatMenuModule} from '@angular/material/menu';
import { ContractorsCatalogComponent } from './contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import { LoginComponent } from './login-registration/login.component';
import {UserAuthService} from './services/user-auth.service';
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {AuthTokenInterceptor} from './interceptors/auth-token-interceptor';
import { RegistrationComponent } from './login-registration/registration/registration.component';
import { SettingsComponent } from './settings/settings.component';
import { SellerComponent } from './settings/seller/seller.component';
import { GusContractorComponent } from './contractors/add-contractor/gus-contractor/gus-contractor/gus-contractor.component';
import { PrintInvoiceComponent } from './invoices/print-invoice/print-invoice.component';
import { PaymentComponent } from './payment/payment.component';
import { SettleInvoiceComponent } from './invoices/settle-invoice/settle-invoice/settle-invoice.component';
import { PaymentDetailsComponent } from './payment/payment-details/payment-details/payment-details.component';
import { InvoicesMapComponent } from './checkbox-component/invoices-map/invoices-map/invoices-map.component';
import { PaymentsMapComponent } from './checkbox-component/payments-map/payments-map/payments-map.component';
import { DeletePaymentComponent } from './payment/delete-payment/delete-payment/delete-payment.component';




// tslint:disable-next-line:typedef
export function jwtOptionsFactory(userAuthService: UserAuthService) {
  return {
    tokenGetter: () => {
      return userAuthService.getTokenFromService();
    },
    allowedDomains: ['localhost:8080'],
    disallowedRoutes: ['http://localhost:8080/v1/library/login', 'http://localhost:8080/v1/library/token/refresh']
  };
}
@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    AddInvoiceComponent,
    DeleteInvoiceComponent,
    PageNotFoundComponent,
    DatePipeComponent,
    AddContractorComponent,
    ContractorsComponent,
    DeleteContractorComponent,
    ContractorsCatalogComponent,
    LoginComponent,
    RegistrationComponent,
    SettingsComponent,
    SellerComponent,
    GusContractorComponent,
    PrintInvoiceComponent,
    PaymentComponent,
    SettleInvoiceComponent,
    PaymentDetailsComponent,
    InvoicesMapComponent,
    PaymentsMapComponent,
    DeletePaymentComponent,

  ],
  imports: [
    BrowserModule, AppRoutingModule, MatDialogModule, HttpClientModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule,
    MatButtonModule, MatIconModule, MatToolbarModule, CommonModule,
    Ng2SearchPipeModule, MatAutocompleteModule, NgbModule, MatSelectModule, _MatMenuDirectivesModule, MatMenuModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [UserAuthService]
      }
    })
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true},
    HttpService, InvoiceService, CheckboxService,
    ProductService, SellerService, ContractorService, DatePipe, DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
