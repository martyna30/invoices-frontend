import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AddInvoiceComponent } from './invoices/add-invoice/add-invoice.component';
import {AppRoutingModule} from './app-routing.module';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {HttpService} from './services/http.service';
import {InvoiceService} from './services/invoice.service';
import {CheckboxService} from './services/checkbox.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
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

@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    AddInvoiceComponent,
    DeleteInvoiceComponent,
    PageNotFoundComponent
  ],
    imports: [
        BrowserModule, AppRoutingModule, MatDialogModule, HttpClientModule,
        FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
        MatFormFieldModule, MatInputModule, MatTooltipModule,
        MatButtonModule, MatIconModule, MatToolbarModule, CommonModule,
        Ng2SearchPipeModule, MatAutocompleteModule, NgbModule, MatSelectModule
    ],
  providers: [
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {} },
    HttpService, InvoiceService, CheckboxService,
    ProductService, SellerService, ContractorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
