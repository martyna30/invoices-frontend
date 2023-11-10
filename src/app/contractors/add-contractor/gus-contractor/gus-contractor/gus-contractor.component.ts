import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('childContractor')
  contractorComponent: AddContractorComponent;
  @Input()
  gusFormIsHidden;
  validationErrors: ContractorValidationError;
  myFormModel: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      vatIdentificationNumberInput: '',
    });
  }
  download(nip: string) {
    this.contractorComponent.getContractorFromGus(nip);
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

}
