import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoicesComponent} from './invoices/invoices.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';





const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full',  },
  {path: 'invoices', component: InvoicesComponent},

  {path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],

  providers: [],
  exports: [RouterModule],
  })
export class AppRoutingModule {}
