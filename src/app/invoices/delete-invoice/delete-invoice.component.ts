import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InvoiceService} from '../../services/invoice.service';
import {CheckboxService} from '../../services/checkbox.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-delete-invoice',
  templateUrl: './delete-invoice.component.html',
  styleUrls: ['./delete-invoice.component.scss']
})
export class DeleteInvoiceComponent implements OnInit {
  private isHidden: boolean;
  private checkedList: Map<number, number>;
  private isDeleted: boolean;
  @Output()
  loadInvoiceData: EventEmitter<any> = new EventEmitter();
  @Input()
  page;
  @Input()
  size;
  private error: any;

  constructor(private invoiceService: InvoiceService, private checkboxService: CheckboxService) {
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  deleteInvoice() {
    if (this.checkboxService.lengthInvoicesMap() === 1) {
      this.checkedList = this.checkboxService.getInvoicesMap();
      const invoiceId = Number(this.checkedList.keys().next().value);
      if (confirm('Are you sure to delete invoice')) {
        this.invoiceService.deleteInvoice(invoiceId).subscribe(
          (deletedInvoice) => {
            this.isDeleted = true;
            if (this.isDeleted) {
              this.loadInvoiceData.emit();
            }
          }, (response: HttpErrorResponse) => {
        console.log(response.error);
        this.error = response.error;
        this.isDeleted = false;
        if (response.status === 403 || response.status === 401) {
            this.isDeleted = false;
            console.log(response);
            alert('Function available only for the administrator');
        }
        if (this.checkboxService.lengthInvoicesMap() === 0) {
          alert('Check the box');
          this.isHidden = true;
        }
        if (this.checkboxService.lengthInvoicesMap() > 1) {
          alert('More than one checkbox is selected, choose one');
          this.isHidden = true;
        }
        });
      }
    }
  }
}
