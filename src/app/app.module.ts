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
import {HttpClientModule} from '@angular/common/http';
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

  ],
  imports: [
    BrowserModule, AppRoutingModule, MatDialogModule, HttpClientModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule,
    MatButtonModule, MatIconModule, MatToolbarModule, CommonModule,
    Ng2SearchPipeModule, MatAutocompleteModule, NgbModule, MatSelectModule, _MatMenuDirectivesModule, MatMenuModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {} },
    HttpService, InvoiceService, CheckboxService,
    ProductService, SellerService, ContractorService, DatePipe, DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
