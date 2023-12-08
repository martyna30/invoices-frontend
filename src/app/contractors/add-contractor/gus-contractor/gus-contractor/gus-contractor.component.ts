import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ContractorValidationError} from '../../../../models-interface/contractorValidationError';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Contractor} from '../../../../models-interface/contractor';
import {AddContractorComponent} from '../../add-contractor.component';



@Component({
  selector: 'app-gus-contractor',
  templateUrl: './gus-contractor.component.html',
  styleUrls: ['./gus-contractor.component.scss']
})
export class GusContractorComponent implements OnInit {
  @Output()
  addContractorFromTheGus: EventEmitter<string> = new EventEmitter<string>();
// <app-add-contractor #childContractor > </app-add-contractor>
  // @ViewChild('childContractor')
  // contractorComponent: AddContractorComponent;

  gusFormIsHidden = true;
  validationErrors: ContractorValidationError;
  myFormModel: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      vatIdentificationNumberInput: '',
    });
  }

  showContractorForm() {
    if (this.gusFormIsHidden) {
      this.gusFormIsHidden = !this.gusFormIsHidden;
    } else {
      this.gusFormIsHidden = true;
    }
  }
  download(nip: string) {
    // this.contractorComponent.getContractorFromGus(nip);
    this.addContractorFromTheGus.emit(nip);
  }
  cancel() {
    this.clearForm();
    this.gusFormIsHidden = true;
    this.clearForm();
    this.clearValidationErrors();
  }

  clearForm() {
    this.myFormModel.get('vatIdentificationNumberInput').setValue('');
  }
  private clearValidationErrors() {
    this.validationErrors = undefined;
  }


  // tslint:disable-next-line:typedef
  hide() {
    this.gusFormIsHidden = true;
  }
}
