import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CheckboxService} from '../../services/checkbox.service';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {lastValueFrom, Observable, of, Subscription} from 'rxjs';
import {ProductValidationErrors} from '../../models-interface/productValidationErrors';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {formatDate} from '@angular/common';
import {Currencies} from '../../models-interface/currencies';
import {MethodOfPayment} from '../../models-interface/methodOfPayment';
import {Rate} from '../../models-interface/rate';
import {ContractorDto} from '../../models-interface/contractorDto';
import {Contractor} from '../../models-interface/contractor';
import {InvoicesMapComponent} from '../../checkbox-component/invoices-map/invoices-map/invoices-map.component';
import {ContractorsCatalogComponent} from '../../contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import {GusContractorComponent} from '../../contractors/add-contractor/gus-contractor/gus-contractor/gus-contractor.component';
import {ProductsCatalogComponent} from '../products-catalog/products-catalog.component';
import {Invoice} from '../../models-interface/invoice';
import {InvoiceValidationError} from '../../models-interface/invoiceValidationError';
import {ContractorValidationError} from '../../models-interface/contractorValidationError';
import {AddressValidationError} from '../../models-interface/addressValidationError';
import {Seller} from '../../models-interface/seller';
import {Address} from '../../models-interface/address';
import {SellerService} from '../../services/seller.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ContractorService} from '../../services/contractor.service';
import {RateService} from '../../services/rate.service';
import {AddContractorDocumentComponent} from '../../shared/components/addContractorDocument/add-contractor-document.component';

@Component({
  selector: 'app-accept-product',
  templateUrl: './accept-product.component.html',
  styleUrls: ['./accept-product.component.scss']
})
export class AcceptProductComponent implements OnInit {
  rate$: Observable<Rate>;
  private subscriptions = new Subscription();
  @ViewChild('childInvoicesMap')
  invoicesMap: InvoicesMapComponent;
  @ViewChild('childContractorCatalogRef')
  contractorCatalog: ContractorsCatalogComponent;
  @ViewChild('childContractorFromGus')
  contractorFromGus: GusContractorComponent;
  @ViewChild('childProductsCatalogRef')
  productsCatalog: ProductsCatalogComponent;
  @Input()
  invoicesList$: Observable<Array<Invoice>>;
  @ViewChild('contractorDocument')
  contractorDocument: AddContractorDocumentComponent;
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  loadPaymentData: EventEmitter<any> = new EventEmitter<any>();
  isHidden = true;
  private checkedProductsList: Map<number, number>;
  number: number;
  numberOfItem: number;
  myFormModel: FormGroup;
  items: FormArray;
  filteredProductsList: string[] = [];
  validationErrors: InvoiceValidationError;
  sellerFromService: Seller;
  rateOfExchangeInputIsHidden = true;
  currency = 'złoty';
  valueMethodOfPayment = 'Transfer';

  currencies: Currencies [] = [
    {value: 'złoty', viewValue: 'Złoty'},
    {value: 'euro', viewValue: 'Euro'},
  ];

  methodsOfPayment: MethodOfPayment[] = [
    {value: 'transfer', viewValue: 'Transfer'},
    {value: 'cash', viewValue: 'Cash'},
  ];

  periodsOfPayment = [
    {value: '0', viewValue: 0},
    {value: '7', viewValue: 7},
    {value: '14', viewValue: 14},
    {value: '30', viewValue: 30},
    {value: '60', viewValue: 60},
    {value: '90', viewValue: 90},
  ];
  private isCreated: boolean;
  // contractorFormIsHidden = true;
  saveInvoiceWithContractor: any;
  private showProductPlaceholder: any;
  private showPaidPlaceholder: boolean;
  private showMethodOfPaymentPlaceholder: boolean;
  private mode: string;
  private checkboxOfInvoice: number;
  private idProductFromTheCatalog: number;
  private modeCurrency: string;
  private contractor: FormGroup;



  constructor(private fb: FormBuilder, private productService: ProductService,
              private checkboxservice: CheckboxService,
              private sellerService: SellerService, private contractorService: ContractorService,
              private rateService: RateService,
              private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      contractor: this.fb.group({}),
      datesOfExpenses: this.fb.group({
        dateOfExpenseInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
        dateOfPostingKPiRInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
        dateOfPostingVatInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
        dateOfSettlementInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')]
      }),
      payments: this.fb.group({
        periodOfPaymentInput: '',
        methodOfPaymentInput: 'Transfer',
        paidInput: parseInt('0,00')
      }),
      rate: this.fb.group({
        currencyInput: 'złoty',
        rateOfExchangeInput: ['']
      }),
      items: this.fb.array([]),
      netAmountInput: '',
      sumTotalInput: ''
    });
    //this.addNextItem();
    //this.checkTheChangeContractorName();
    // this.sumGrossValue();
    // this.sumNetValue();
    this.sellerFromService = this.sellerService.getSellerValue();
    console.log(this.sellerFromService);
  }

  addContractorForm() {
    this.contractor = this.contractorDocument.contractor as FormGroup;
  }


  acceptProduct() {
    if (this.checkboxservice.lengthProductsMap() === 1) {
      const idProduct = this.checkboxservice.getProductMap().keys().next().value;
      this.productService.acceptProducts(idProduct).pipe(
        catchError(err => {
          console.error('Error', err);
          if (err instanceof HttpErrorResponse) {
            this.validationErrors = err.error;
          }
          this.isCreated = false;
          return of(null);
        })
      ).subscribe((response: any) => {
        if (response !== null && response !== undefined) {
          this.isCreated = true;
          this.loadData.emit();
         // this.closeDialog();
        }
      });
    }
  }

  roundNetWorth() {
    this.items.controls.forEach((itemControl, index) => {
      const netWorth = itemControl.get('netWorthInput').value;
      const nettValue = parseFloat(netWorth).toFixed(2);
      itemControl.get('netWorthInput').patchValue(nettValue);
    });
  }

  setGrossValue(selectElement: HTMLSelectElement) {
    this.items.controls.forEach((itemControl, index) => {
      itemControl.get('grossValueInput').patchValue(
        (+selectElement.value / +100) * +itemControl.get('netWorthInput').value
        + +itemControl.get('netWorthInput').value
      );
      const gross = itemControl.get('grossValueInput').value.toFixed(2);
      itemControl.get('grossValueInput').patchValue(gross);
    });

  }

  sumGrossValue() {
    const subscription = this.items.valueChanges.subscribe(data => {
      const sumTotalInput = data.reduce((a, b) => a + +b.grossValueInput * +b.amountInput, 0);
      const sumTotalRound = sumTotalInput.toFixed(2);
      this.myFormModel.get('sumTotalInput').patchValue(sumTotalRound);
      console.log(subscription);
    });
    this.subscriptions.add(subscription);
  }

  // const netInput = data.reduce((a, b) => a + (+b.netWorthInput) * +b.amountInput, 0);
  sumNetValue() {
    const subscription2 = this.items.valueChanges.subscribe(data => {
      const netInput = data.reduce(function(a, b) {
        return a + (+b.netWorthInput) * +b.amountInput;
      }, 0);
      const netInputRound = netInput.toFixed(2);
      this.myFormModel.get('netAmountInput').patchValue(netInputRound);
      // this.myFormModel.get('netAmountInput').patchValue(netInput);
      console.log(subscription2);

    });
    this.subscriptions.add(subscription2);
  }

  public convertValueByCurrency(currency: string) {
    const rateOfExchange = parseFloat(this.myFormModel.get('rate').get('rateOfExchangeInput').value);

    console.log('rateOfExchange:', rateOfExchange);

    if (currency !== this.currency && !isNaN(rateOfExchange)) {
      this.items.controls.forEach((itemControl) => {
        const netWorth = parseFloat(itemControl.get('netWorthInput').value);
        const grossWorth = itemControl.get('grossValueInput').value;
        console.log('netWorth:', netWorth);

        if (!isNaN(netWorth) && !isNaN(grossWorth) && rateOfExchange !== 0) {
          const convertedNetWorth = (netWorth / rateOfExchange).toFixed(2);
          itemControl.get('netWorthInput').patchValue(convertedNetWorth);
          console.log('convertedNetWorth:', convertedNetWorth);

          const convertedGrossValueWorth = (grossWorth / rateOfExchange).toFixed(2);
          itemControl.get('grossValueInput').patchValue(convertedGrossValueWorth);
        }
      });
    } else {
      console.error('Invalid netWorth or rateOfExchange');
    }
  }


  toggleMethodOfPaymentPlaceholder() {
    this.showMethodOfPaymentPlaceholder = (this.myFormModel.get('methodOfPaymentInput').value === '');
  }

  togglePaidPlaceholder() {
    this.showPaidPlaceholder = (this.myFormModel.get('paidInput').value === '');
  }


  toggleProductPlaceholder() {
    this.items.controls.forEach((productControl, index) => {
      this.showProductPlaceholder[index] = (productControl.get('productInput').value === '');
    });
  }

  addNextItem() {
    this.items = this.myFormModel.get('items') as FormArray;
    this.items.push(this.createProduct());
    this.toggleProductPlaceholder();
    // this.checkTheChangeProduct();
  }

  createProduct(): FormGroup {
    return this.fb.group({
      productInput: '',
      productSelect: '',
      numberInput: '',
      unitInput: 'pc',
      amountInput: '1',
      netWorthInput: '',
      vatRateInput: '23',
      grossValueInput: '',
    });
  }


  addProductFromTheCatalog() {
    this.checkedProductsList = this.checkboxservice.getProductFromTheCatalogMap();
    this.idProductFromTheCatalog = this.checkedProductsList.keys().next().value;
    this.productService.getProductById(this.idProductFromTheCatalog).subscribe((productFromDb) => {
      // this.myFormModel.get('item').get('numberInput').setValue(productFromDb.);
      this.myFormModel.get('items').value[this.numberOfItem].get('productInput').setValue(productFromDb.nameOfProduct);
    });
  }


  closeDialog(): void {
    this.isHidden = true;
    this.clearInvoiceForm();
    this.clearValidationErrors();
    this.checkboxservice.removeFromInvoicesMap(this.checkboxOfInvoice);
  }

  private clearInvoiceForm() {
    // this.clearContractorForm();
    this.myFormModel.get('paidInput').setValue(parseInt('0,00')),
      this.myFormModel.get('netAmountInput').setValue(''),
      this.myFormModel.get('sumTotalInput').setValue(''),
      this.items.controls.forEach(productControl => {
        productControl.get('productInput').setValue(''),
          productControl.get('netWorthInput').setValue(''),
          productControl.get('grossValueInput').setValue('');

      });
  }

  private clearValidationErrors() {
    this.validationErrors = undefined;
  }


  deleteItem(circle: HTMLElement) {
    this.items.removeAt(Number(circle.id));
  }


  saveExpense() {

  }

  async toggleCurrency() {
    const currency = this.myFormModel.get('rate').get('currencyInput').value;
    const effectiveDate = this.myFormModel.get('dates').get('dateOfInvoiceInput').value;
    if (currency !== this.currency) {
      this.modeCurrency = 'euro';
      this.rateOfExchangeInputIsHidden = !this.rateOfExchangeInputIsHidden;
      try {
        this.rate$ = await
          lastValueFrom(this.rateService.getRateByCurrencyAndEffectiveDate(currency, effectiveDate)).then(
            (rate: { rateOfExchange: any; }) => {
              this.myFormModel.get('rate').get('rateOfExchangeInput').setValue(rate.rateOfExchange);
            });

        this.convertValueByCurrency(currency);
      } catch (error) {
        console.error('Error fetching rate:', error);
      }
    }

  }

  /*clearContractorForm() {
   this.myFormModel.get('contractor').get('nameInput').setValue(''),
     this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('streetInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('cityInput').setValue(''),
     this.myFormModel.get('contractor').get('address').get('countryInput').setValue('');
 }*/

  /*addContractorFromTheGus(nip: string) {
   this.mode = 'gus';
   this.contractorService.getContractorByNip(nip).subscribe((contractorFromGus) => {
     if (contractorFromGus !== undefined) {
       this.myFormModel.get('contractor').get('nameInput').setValue(contractorFromGus.name);
       this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(contractorFromGus.vatIdentificationNumber);
       this.myFormModel.get('contractor').get('address').get('streetInput').setValue(contractorFromGus.address.street);
       this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(contractorFromGus.address.streetNumber);
       this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(contractorFromGus.address.postcode);
       this.myFormModel.get('contractor').get('address').get('cityInput').setValue(contractorFromGus.address.city);
       this.myFormModel.get('contractor').get('address').get('countryInput').setValue('Poland');
       this.contractorFromGus.hide();
     }
   });
 }*/

  openProductsCatalog(mode: string, numberOfItem: number) {
    this.numberOfItem = numberOfItem;
    this.mode = mode;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'contractors-modalbox';
    const gusDialogConfig = new MatDialogConfig();
    gusDialogConfig.disableClose = true;
    gusDialogConfig.autoFocus = true;
    gusDialogConfig.panelClass = 'gus-modalbox';
    gusDialogConfig.position = {
      top: '0px',
      bottom: '150px',
      left: '1200px',
      right: '1000px'
    };
    if (mode === 'catalogOfProducts') {
      this.dialog.open(ProductsCatalogComponent, dialogConfig);
      this.productsCatalog.showProductCatalog();
    }
  }

  isCloseButtonHidden(isHidden: boolean) {
    return isHidden;
  }

  contractorFormIsHidden(isHidden: boolean) {
   return isHidden;
  }
}


