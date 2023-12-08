import { Component, OnInit } from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  private checkedList: Map<number, number>;
  private idInvoice: number;
  private isCreated: boolean;

  constructor(private checkboxService: CheckboxService, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
  }

  printInvoice() {
    this.checkedList = this.checkboxService.getInvoicesMap();
    if (this.checkboxService.lengthInvoicesMap() === 1) {
      this.idInvoice = this.checkedList.keys().next().value;
      this.invoiceService.generateInvoice(this.idInvoice).subscribe(httpResponse => {
        if (httpResponse.status === 201 || httpResponse.status === 200) {
           this.isCreated = true;
        }
        if (this.isCreated) {
          //this.loadData.emit();
        }
     }, (response: HttpErrorResponse) => {
       this.isCreated = false;
       console.log(response);
     });
    }
  }
}

