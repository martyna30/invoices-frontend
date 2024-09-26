import { Component, OnInit } from '@angular/core';
import {CheckboxService} from '../../../services/checkbox.service';

@Component({
  selector: 'app-invoices-map',
  templateUrl: './invoices-map.component.html',
  styleUrls: ['./invoices-map.component.scss']
})
export class InvoicesMapComponent implements OnInit {
  private checkedList: Map<number, number>;
  private idInvoice: number;

  private checkboxOfInvoice: number;
  constructor(private checkboxService: CheckboxService) { }

  ngOnInit(): void {
  }



  getInvoiceIdFromMap() {
    this.checkedList = this.checkboxService.getInvoicesMap();
    this.idInvoice = this.checkedList.keys().next().value;
    console.log(this.idInvoice);
    return this.idInvoice;
  }

  checkOrInvoicesMapEqualsOne(): boolean {
    if (this.checkboxService.lengthInvoicesMap() === 1) {
      return true;
    }
  }
  checkOrInvoicesMapEqualsZero(): boolean {
    if (this.checkboxService.lengthInvoicesMap() === 0) {
      alert('Check the box');
      return false;
    }
  }

  checkOrInvoicesMapIsMoreThanOne() {
    if (this.checkboxService.lengthInvoicesMap() > 1) {
      alert('More than one checkbox is selected, choose one');
      return false;
    }
  }








}
