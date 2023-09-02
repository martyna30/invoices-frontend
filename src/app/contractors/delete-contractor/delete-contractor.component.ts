import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {ContractorService} from '../../services/contractor.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-delete-contractor',
  templateUrl: './delete-contractor.component.html',
  styleUrls: ['./delete-contractor.component.scss']
})
export class DeleteContractorComponent implements OnInit {
  private isHidden: boolean;
  private checkedList: Map<number, number>;
  private isDeleted: boolean;
  @Output()
  loadContractorsData: EventEmitter<any> = new EventEmitter();
  @Input()
  page;
  @Input()
  size;
  private error: any;

  constructor(private contractorService: ContractorService, private checkboxService: CheckboxService) {
  }

  ngOnInit(): void {
  }
  // tslint:disable-next-line:typedef
  deleteContractor() {
    if (this.checkboxService.lengthContractorsMap() === 1) {
      this.checkedList = this.checkboxService.getContractorsMap();
      const contractorId = Number(this.checkedList.keys().next().value);
      if (confirm('Are you sure to delete contractor')) {
        this.contractorService.deleteContractor(contractorId).subscribe(
          (deletedContractor) => {
            this.isDeleted = true;
            if (this.isDeleted) {
              this.loadContractorsData.emit();
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
            if (this.checkboxService.lengthContractorsMap() === 0) {
              alert('Check the box');
              this.isHidden = true;
            }
            if (this.checkboxService.lengthContractorsMap() > 1) {
              alert('More than one checkbox is selected, choose one');
              this.isHidden = true;
            }
          });
      }
    }
  }
}
