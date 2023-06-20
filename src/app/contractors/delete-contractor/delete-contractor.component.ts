import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-contractor',
  templateUrl: './delete-contractor.component.html',
  styleUrls: ['./delete-contractor.component.scss']
})
export class DeleteContractorComponent implements OnInit {
  @Output()
  loadContractorsData: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  deleteContractor() {

  }
}
