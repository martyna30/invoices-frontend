import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {ContractorsComponent} from './contractors/contractors.component';
import {ContractorsCatalogComponent} from './contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';





const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full',  },
  {path: 'invoices', component: InvoicesComponent},
  {path: 'contractors', component: ContractorsComponent},
  {path: 'contractorsCatalog', component: ContractorsCatalogComponent},

  {path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],

  providers: [],
  exports: [RouterModule],
  })
export class AppRoutingModule {}
