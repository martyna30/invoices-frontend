import { Component, OnInit } from '@angular/core';
import {CheckboxService} from '../../../services/checkbox.service';
import {formatDate} from '@angular/common';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-payments-map',
  templateUrl: './payments-map.component.html',
  styleUrls: ['./payments-map.component.scss']
})
export class PaymentsMapComponent implements OnInit {
  private checkedList: Map<number, number>;
  private idPayment: number;
  private isHidden: boolean;
  myFormModel: FormGroup;
  constructor(private checkboxservice: CheckboxService) { }

  ngOnInit(): void {
  }

  getPaymentIdFromMap(): number {
    this.checkedList = this.checkboxservice.getPaymentsMap();
    this.idPayment = this.checkedList.keys().next().value;
    return this.idPayment;
  }

  refresh(): void {
    window.location.reload();
  }



  checkOrPaymentsMapEqualsOne(): boolean {
    if (this.checkboxservice.lengthPaymentsMap() === 1) {
      return true;
    }
  }
  checkOrPaymentsMapEqualsZero(): boolean {
    if (this.checkboxservice.lengthPaymentsMap() === 0) {
      alert('Check the box');
      this.isHidden = true;
      return false;
    }
  }

  checkOrPaymentsMapIsMoreThanOne() {
    if (this.checkboxservice.lengthPaymentsMap() > 1) {
      alert('More than one checkbox is selected, choose one');
      this.isHidden = true;
      return false;
    }
  }








}

