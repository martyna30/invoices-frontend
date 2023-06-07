import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {InvoiceValidationError} from '../../models-interface/invoiceValidationError';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {Invoice} from '../../models-interface/invoice';
import {Item} from '../../models-interface/item';
import {Observable, Subscription} from 'rxjs';
import {SellerService} from '../../services/seller.service';
import {ContractorService} from '../../services/contractor.service';
import {ProductService} from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Contractor} from '../../models-interface/contractor';
import {Address} from '../../models-interface/address';
import {ContractorValidationError} from '../../models-interface/contractorValidationError';
import {AddressValidationError} from '../../models-interface/addressValidationError';
import {MethodOfPayment} from '../../models-interface/methodOfPayment';
import {parse} from 'jasmine-spec-reporter/built/configuration-parser';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';

const resolvedPromise = Promise.resolve(null);
@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],

})
export class AddInvoiceComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  subscription2: Subscription;
  @Input()
  invoicesList$: Observable<Array<Invoice>>;
  @Input()
  private checkboxOfInvoice: number;
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  isHidden = true;
  isHiddenContractor = true;
  private mode: string;
  private contractorMode: string;
  myFormModel: FormGroup;
  items: FormArray;
  contractor: FormGroup;
  address: FormGroup;
  methods: FormGroup;
  filteredSellers: string[] = [];
  filteredName: string[] = [];
  filteredProductsList: string[] = [];
  private showSellerPlaceholder: boolean;
  private showContractorPlaceholder = [];
  private showProductPlaceholder = [];
  private showDateOfIssuePlaceholder: boolean;
  private showDateOfSalePlaceholder: boolean;
  private showDateOfPaymentPlaceholder: boolean;
  validationErrors: InvoiceValidationError;
  contractorValidationErrors: ContractorValidationError;
  addressValidationErrors: AddressValidationError;
  private checkedList: Map<number, number>;
  private idInvoice: number;
  private invoiceToModified: Invoice;
  invoiceFromDb: Invoice;
  contractorToModified: Contractor;
  private addressToModified: Address;
  private isCreated: boolean;
  private invoiceExist: boolean;
  private showNamePlaceholder: boolean;
  private showMethodOfPaymentPlaceholder: boolean;
  private showPaidPlaceholder: boolean;
  private showVATPlaceholder: boolean;
  methodsOfPayment: MethodOfPayment[] = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'transfer', viewValue: 'Transfer'},
  ];

  periodsOfPayment = [
    {value: '0', viewValue: 0 },
    {value: '7', viewValue: 7 },
    {value: '14', viewValue: 14 },
    {value: '30', viewValue: 30 },
    {value: '60', viewValue: 60 },
    {value: '90', viewValue: 90 },
  ];

  vatRates = [
    {value: '23', viewValue: '23%' },
    {value: '8', viewValue: '8%' },
    {value: '5', viewValue: '5%' },
    {value: '0', viewValue: '0%' },
  ];

  // sumTotalInput: string;



  constructor(private fb: FormBuilder, private checkboxservice: CheckboxService,
              private invoiceService: InvoiceService, private sellerService: SellerService,
              private contractorService: ContractorService, private productService: ProductService,
              private ref: ChangeDetectorRef) {

  }
  ngOnInit(): void {

    this.myFormModel = this.fb.group({
      contractor: this.fb.group({
        nameInput: '',
        vatIdentificationNumberInput: '',
        address: this.fb.group({
          streetInput: '',
          streetNumberInput: '',
          postcodeInput: '',
          cityInput: ''
        }),
      }),
      dateOfInvoiceInput: '',
      dateOfSaleInput: '',
      periodOfPaymentInput: '',
      methodOfPaymentInput: '',
      paidInput: '',
      items: this.fb.array([]),
      netAmountInput: '',
      sumTotalInput: ''
    });
    this.addNextItem();
    // this.checkTheChangeSeller();
    // this.checkTheChangeContractorName();
    this.sumGrossValue();
    this.sumNetValue();
  }




    //this.items.controls.forEach((item, index) => {
        //item.get('grossValueInput').patchValue(
    /*const index = this.items.controls.length - 1;
    const netInput = this.items.controls[index].get('netWorthInput');
    const vatRateInput = this.items.controls[index].get('vatRateInput');
    let bruttoInput;
    // tslint:disable-next-line:radix
    bruttoInput = netInput.value * vatRateInput.value;
    this.items.controls[index].get('grossValueInput').patchValue(bruttoInput);*/


  showAddInvoiceForm() {
    this.mode = 'add';
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  // tslint:disable-next-line:typedef
  showEditInvoiceForm() {
    this.mode = 'edit';
    this.isHidden = false;
    this.checkedList = this.checkboxservice.getInvoicesMap();
    if (this.checkboxservice.lengthInvoicesMap() === 1) {
      this.idInvoice = this.checkedList.keys().next().value;
      this.invoiceService.getInvoiceById(this.idInvoice).subscribe((invoiceFromDb) => {
        this.invoiceToModified = invoiceFromDb;
        this.contractorToModified = invoiceFromDb.contractor;
        this.addressToModified = this.contractorToModified.address;
        this.myFormModel.get('contractor').get('nameInput').setValue(this.contractorToModified.name);
        this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(this.contractorToModified.vatIdentificationNumber);
        this.myFormModel.get('contractor').get('address').get('streetInput').setValue(this.addressToModified.street);
        this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(this.addressToModified.streetNumber);
        this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(this.addressToModified.postcode);
        this.myFormModel.get('contractor').get('address').get('cityInput').setValue(this.addressToModified.city);
        this.myFormModel.get('dateOfInvoiceInput').setValue(invoiceFromDb.dateOfInvoice);
        this.myFormModel.get('dateOfSaleInput').setValue(invoiceFromDb.dateOfSale);
        this.myFormModel.get('periodOfPaymentInput').setValue(invoiceFromDb.periodOfPayment);
        this.myFormModel.get('methodOfPaymentInput').setValue(invoiceFromDb.methodOfPayment);
        this.myFormModel.get('paidInput').setValue(invoiceFromDb.paid);
        this.myFormModel.get('netAmountInput').setValue(invoiceFromDb.netAmount);
        this.myFormModel.get('sumTotalInput').setValue(invoiceFromDb.sumTotal);
        while (this.items.length > invoiceFromDb.items.length) {
        this.items.removeAt(0);
      }
        // tslint:disable-next-line:no-unused-expression
        invoiceFromDb.items.forEach((product, index) => {
          if (index >= this.items.length) {
            this.addNextItem();
          }
          this.items.at(index).get('productInput').setValue(product.product);
          this.items.at(index).get('amountInput').setValue(product.amount);
          this.items.at(index).get('netWorthInput').setValue(product.netWorth);
          this.items.at(index).get('vatRateInput').setValue(product.vatRate);
          this.items.at(index).get('grossValueInput').setValue(product.grossValue);
        });
      });
    }
    if (this.checkboxservice.lengthInvoicesMap() === 0) {
      alert('Brak zaznaczonego');
      this.isHidden = true;
    }
    if (this.checkboxservice.lengthInvoicesMap() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
      this.isHidden = true;
    }
  }

  setGrossValue(selectElement: HTMLSelectElement) {
    this.items.controls.forEach((itemControl, index) => {
      itemControl.get('grossValueInput').patchValue(
        (+selectElement.value / +100) * +itemControl.get('netWorthInput').value
          + itemControl.get('netWorthInput').value
      );
    });
  }

  sumGrossValue() {
    this.subscription = this.items.valueChanges.subscribe(data => {
    const sumTotalInput = data.reduce((a, b) => a + +b.grossValueInput, 0);
    this.myFormModel.get('sumTotalInput').patchValue(sumTotalInput);
  });
  }

  sumNetValue() {
    this.subscription2 = this.items.valueChanges.subscribe(data => {
      const netInput = data.reduce((a, b) => a + +b.netWorthInput * +b.amountInput, 0);
      this.myFormModel.get('netAmountInput').patchValue(netInput);
    });
  }

  /*multiplyValue() {
    this.items.controls.forEach(item => {
      item.get('netAmountInput').patchValue(
        item.get('amountInput').value * +item.get('netWorthInput').value
      );
    });
  }*/


  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

saveInvoice() {
    if (this.mode === 'edit') {
      this.changeInvoice();
    } else {
      const invoice: Invoice = {
        id: null,
        contractor: {
          id: null,
          name: this.myFormModel.get('contractor').get('nameInput').value,
          vatIdentificationNumber: this.myFormModel.get('contractor').get('vatIdentificationNumberInput').value,
          address: {
            id: null,
            street: this.myFormModel.get('contractor').get('address').get('streetInput').value,
            streetNumber: this.myFormModel.get('contractor').get('address').get('streetNumberInput').value,
            postcode: this.myFormModel.get('contractor').get('address').get('postcodeInput').value,
            city: this.myFormModel.get('contractor').get('address').get('cityInput').value
          }
        },
        dateOfInvoice: this.myFormModel.get('dateOfInvoiceInput').value,
        dateOfSale: this.myFormModel.get('dateOfSaleInput').value,
        periodOfPayment: this.myFormModel.get('periodOfPaymentInput').value,
        methodOfPayment: this.myFormModel.get('methodOfPaymentInput').value,
        paid: this.myFormModel.get('paidInput').value,
        items: [],
        netAmount: this.myFormModel.get('netAmountInput').value,
        sumTotal: this.myFormModel.get('sumTotalInput').value
      };

      this.items.controls.forEach(productControl => {
        const item: Item = {
          id: null,
          product: productControl.get('productInput').value,
          amount: productControl.get('amountInput').value,
          netWorth: productControl.get('netWorthInput').value,
          vatRate: productControl.get('vatRateInput').value,
          grossValue: productControl.get('grossValueInput').value,
        };
      });
      this.invoiceService.saveInvoice(invoice).subscribe(saveInvoice => {
        if (saveInvoice !== undefined) {
          this.isCreated = true;
          this.invoiceExist = false;
        }
        if (this.isCreated) {
          this.loadData.emit();
          this.closeDialog();
        }
      }, (response: HttpErrorResponse) => {
        this.validationErrors = response.error;
        this.isCreated = false;
       // if (response.status === 403 || response.status === 401) {
         // alert('Function available only for the administrator');
        alert('Function');
      });
     // });
    }
}

  // tslint:disable-next-line:typedef
  private changeInvoice() {
    const invoice: Invoice = {
      id: this.idInvoice,
      contractor: {
        id: null,
        name: this.myFormModel.get('contractor').get('nameInput').value,
        vatIdentificationNumber: this.myFormModel.get('contractor').get('vatIdentificationNumberInput').value,
        address: {
          id: null,
          street: this.myFormModel.get('contractor').get('address').get('streetInput').value,
          streetNumber: this.myFormModel.get('contractor').get('address').get('streetNumberInput').value,
          postcode: this.myFormModel.get('contractor').get('address').get('postcodeInput').value,
          city: this.myFormModel.get('contractor').get('address').get('cityInput').value
        }
    },
      dateOfInvoice: this.myFormModel.get('dateOfInvoiceInput').value,
      dateOfSale: this.myFormModel.get('dateOfSaleInput').value,
      periodOfPayment: this.myFormModel.get('periodOfPaymentInput').value,
      methodOfPayment: this.myFormModel.get('methodOfPaymentInput').value,
      paid: this.myFormModel.get('paidInput').value,
      items: [],
      netAmount: this.myFormModel.get('netAmountInput').value,
      sumTotal: this.myFormModel.get('sumTotalInput').value
    };
    this.items.controls.forEach(productControl => {
      const product: Item = {
        id: null,
        product: productControl.get('productInput').value,
        amount: productControl.get('amountInput').value,
        netWorth: productControl.get('netWorthInput').value,
        vatRate: productControl.get('vatRateInput').value,
        grossValue: productControl.get('grossValueInput').value,
      };
      invoice.items.push(product);
    });
    this.invoiceService.updateInvoice(invoice).subscribe(updateInvoice => {
        if (updateInvoice !== undefined) {
          this.isCreated = true;
        }
        if (this.isCreated) {
          this.loadData.emit();
          this.closeDialog();
        }
      }, (response: HttpErrorResponse) => {
        this.validationErrors = response.error;
        this.isCreated = false;
        if (response.status === 403 || response.status === 401) {
          alert('Function available only for the administrator');
        }
      });
  }
  // addAdress() {
   // this.address = this.myFormModel.get('address') as FormGroup;
    // this.address.push(this.createAddress());
   //
 // }

createProduct(): FormGroup {
    return this.fb.group( {
      productInput: '',
      amountInput: '1',
      netWorthInput: '',
      vatRateInput: '',
      grossValueInput: '',
    });
  }
addNextItem() {
   this.items = this.myFormModel.get('items') as FormArray;
   this.items.push(this.createProduct());
   this.toggleProductPlaceholder();
   // this.checkTheChangeProduct();
  }
  // tslint:disable-next-line:typedef
deleteItem(circle: HTMLElement) {
    this.items.removeAt(Number(circle.id));
  }

  /*private checkTheChangeSeller() {
    this.myFormModel.get('sellerInput').valueChanges.subscribe(
      response => this.filterSellers(response)
    );
  }*/

  /*private filterSellers(response) {
    // tslint:disable-next-line:no-shadowed-variable
    this.sellerService.getSellerWithSpecifiedName(response).subscribe(seller => {
      this.filteredSellers = seller.map(seller => seller.name);
    });
  }*/
checkTheChangeContractorName() {
    this.contractor.get('nameInput').valueChanges.subscribe(
      response => this.filterContractor(response)
    );
  }

  // tslint:disable-next-line:typedef
  private filterContractor(response) {
    this.contractorService.getBuyerWithSpecifiedName(response).subscribe(buyer => {
      // tslint:disable-next-line:no-shadowed-variable
      this.filteredName = buyer.map(buyer => buyer.name);
      console.log(buyer);
      if (this.filteredName === null && this.filteredName === undefined) {
       // this.showAddContractorForm();
      }
    });
  }

showAddContractorForm() {
    this.contractorMode  = 'add';
    if (this.isHiddenContractor) {
      this.isHiddenContractor = !this.isHiddenContractor;
    } else {
      this.isHiddenContractor = true;
    }
  }


  // tslint:disable-next-line:typedef
 /* private checkTheChangeProduct() {
    this.myFormModel.get('productInput').valueChanges.subscribe(
      product => this.filterProduct(product)
    );
  }*/
  /*private filterProduct(product) {
    this.productService.getProductWithSpecifiedName(product).subscribe(product => {
      this.filteredProductsList = product.map(product => product.name);
    });
  }*/

// Contractor
toggleNamePlaceholder() {
    this.showNamePlaceholder = (this.myFormModel.get('contractor').get('nameInput').value === '');
  }

toggleVATPlaceholder() {
    this.showVATPlaceholder = (this.myFormModel.get('contractor').get('vatIdentificationNumberInput').value === '');
  }

  // contractor/address


toggleDateOfIssuePlaceholder() {
    this.showDateOfIssuePlaceholder = (this.myFormModel.get('dateOfInvoiceInput').value === '');
  }

toggleDateOfSalePlaceholder() {
    this.showDateOfSalePlaceholder = (this.myFormModel.get('dateOfSaleInput').value === '');
  }

toggleMethodOfPaymentPlaceholder(){
    this.showMethodOfPaymentPlaceholder = (this.myFormModel.get('methodOfPaymentInput').value === '');
  }

togglePaidPlaceholder() {
    this.showPaidPlaceholder = (this.myFormModel.get('paidInput').value === '');
  }
// items
toggleProductPlaceholder() {
    this.items.controls.forEach((productControl, index) => {
      this.showProductPlaceholder[index] = (productControl.get('productInput').value === '');
    });
  }


closeDialog(): void {
    this.isHidden = true;
    this.clearBookForm();
    this.clearValidationErrors();
    this.checkboxservice.removeFromInvoicesMap(this.checkboxOfInvoice);
  }

  private clearBookForm() {

    this.myFormModel.get('contractor').get('nameInput').setValue(''),
    this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(''),
   this.myFormModel.get('contractor').get('address').get('streetInput').setValue(''),
    this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(''),
    this.myFormModel.get('contractor').get('address').get('cityInput'),
    this.myFormModel.get('dateOfInvoiceInput').setValue(''),
     this.myFormModel.get('dateOfSaleInput').setValue(''),
     this.myFormModel.get('periodOfPaymentInput').setValue(''),
      this.myFormModel.get('methodOfPaymentInput').setValue(''),
      this.myFormModel.get('paidInput').setValue(''),
      this.myFormModel.get('netAmountInput').setValue(''),
      this.myFormModel.get('sumTotalInput').setValue(''),
      this.items.controls.forEach(productControl => {
         productControl.get('productInput').setValue(''),
         productControl.get('amountInput').setValue(''),
         productControl.get('netWorthInput').setValue(''),
         productControl.get('vatRateInput').setValue(''),
           productControl .get('grossValueInput').setValue('');
      });
  }

  private clearValidationErrors() {
    this.validationErrors = undefined;
  }



}
