import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import * as url from 'url';
import {SettingsComponent} from '../../settings/settings.component';
import {Seller} from '../../models-interface/seller';
import {BehaviorSubject} from 'rxjs';
import {Invoice} from '../../models-interface/invoice';
import {SellerService} from '../../services/seller.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  private checkedList: Map<number, number>;
  private idInvoice: number;
  private isCreated: boolean;
  currentSellerId;
  // @ViewChild('settingsChild')
  // settingsComponent: SettingsComponent;
// <app-settings #settingsChild ></app-settings>


  constructor(private checkboxService: CheckboxService, private invoiceService: InvoiceService,
              private sellerService: SellerService, private router: Router) { }

  ngOnInit(): void {}

  printInvoice() {
    this.checkedList = this.checkboxService.getInvoicesMap();
    this.sellerService.getSellerByAppUserFromService().subscribe(sellerFrom => {
      this.currentSellerId = sellerFrom.id;
    });
    if (this.checkboxService.lengthInvoicesMap() === 1) {
      this.idInvoice = this.checkedList.keys().next().value;

      this.invoiceService.generateInvoice(this.idInvoice, this.currentSellerId).subscribe(httpResponse => {
          if (httpResponse.status === 201 || httpResponse.status === 200) {
            this.isCreated = true;
            const fileURL = URL.createObjectURL(httpResponse);
            window.open(fileURL, '_blank');
            if (this.isCreated) {
              // this.loadData.emit();
            }
          }
        }
        , (response: HttpErrorResponse) => {
          this.isCreated = false;
          console.log(response);
        });
    }
  }


  openNewTab() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/file:///home/martyna/Pulpit/pdfPlik.plik.pdf'])
    );

    window.open(url, '_blank');
  }
}

