import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ContractorsComponent} from './contractors/contractors.component';
import {ContractorsCatalogComponent} from './contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import {LoginComponent} from './login-registration/login.component';
import {RegistrationComponent} from './login-registration/registration/registration.component';
import {SettingsComponent} from './settings/settings.component';
import {PrintInvoiceComponent} from './invoices/print-invoice/print-invoice.component';
import {PaymentComponent} from './payment/payment.component';
import {PaymentDetailsComponent} from './payment/payment-details/payment-details/payment-details.component';



const routes: Routes = [
  {path: '', redirectTo: '/strona', pathMatch: 'full', },
  {path: 'strona', component: InvoicesComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'details', component: PaymentDetailsComponent},
  {path: 'invoices', component: InvoicesComponent},
  {path: 'invoices/print', component: PrintInvoiceComponent},
  {path: 'contractors', component: ContractorsComponent},
  {path: 'contractorsCatalog', component: ContractorsCatalogComponent},
  {path: 'login', component: LoginComponent },
  {path: 'registration', component: RegistrationComponent },
  {path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],

  providers: [],
  exports: [RouterModule],
  })
export class AppRoutingModule {}
