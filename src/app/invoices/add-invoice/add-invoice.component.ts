import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit, Optional,
  Output,
  ViewChild
} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InvoiceValidationError} from '../../models-interface/invoiceValidationError';
import {CheckboxService} from '../../services/checkbox.service';
import {InvoiceService} from '../../services/invoice.service';
import {Invoice} from '../../models-interface/invoice';
import {Item} from '../../models-interface/item';
import {lastValueFrom, of, take, tap} from 'rxjs';
import { Observable, Subscription} from 'rxjs';
import {SellerService} from '../../services/seller.service';
import {ContractorService} from '../../services/contractor.service';
import {ProductService} from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Address} from '../../models-interface/address';
import {ContractorValidationError} from '../../models-interface/contractorValidationError';
import {AddressValidationError} from '../../models-interface/addressValidationError';
import {MethodOfPayment} from '../../models-interface/methodOfPayment';
import {Currencies} from '../../models-interface/currencies';
import {DatePipe, DecimalPipe, formatDate} from '@angular/common';
import {ContractorDto} from '../../models-interface/contractorDto';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ContractorsCatalogComponent} from '../../contractors/contractors-catalog/contractors-catalog/contractors-catalog.component';
import {Contractor} from '../../models-interface/contractor';
import {ContractorsComponent} from '../../contractors/contractors.component';
import {GusContractorComponent} from '../../contractors/add-contractor/gus-contractor/gus-contractor/gus-contractor.component';
import {Payment} from '../../models-interface/payment';
import {InvoicesMapComponent} from '../../checkbox-component/invoices-map/invoices-map/invoices-map.component';
import {Seller} from '../../models-interface/seller';
import {UserAuthService} from '../../services/user-auth.service';
import {RateService} from '../../services/rate.service';
import {Rate} from '../../models-interface/rate';
import {ProductsCatalogComponent} from '../../products/products-catalog/products-catalog.component';


@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],

})
export class AddInvoiceComponent implements OnInit, OnDestroy {
  rate$: Observable<Rate>;
  contractorFromGusIsHidden = true;
  contractorCatalogIsHidden = true;
  private positionRelativeToElement: ElementRef;
  contractorError: ContractorDto;
  contractors: Array<Contractor>;
  contractorWithName: Contractor;
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
  @Input()
  private checkboxOfInvoice: number;
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  loadPaymentData: EventEmitter<any> = new EventEmitter<any>();
  isHidden = true;
  settingsIsHidden = true;
  contractorFormIsHidden = true;
  isHiddenContractor = true;
  items$: Observable<any>;
  isCloseButtonHidden = false;
  private mode: string;
  private contractorMode: string;
  number: number;
  numberOfItem: number;
  myFormModel: FormGroup;
  items: FormArray;
  filteredSellers: string[] = [];
  filteredName: string[] = [];
  filteredProductsList: string[] = [];
  private idContractorFromTheCatalog: number;
  private idProductFromTheCatalog: number;
  private showSellerPlaceholder: boolean;
  private showContractorPlaceholder = [];
  private showProductPlaceholder = [];
  validationErrors: InvoiceValidationError;
  contractorValidationErrors: ContractorValidationError;
  addressValidationErrors: AddressValidationError;
  private checkedList: Map<number, number>;
  private checkedContractorList: Map<number, number>;
  private checkedProductsList: Map<number, number>;
  private idInvoice: number;
  private invoiceToModified: Invoice;
  invoiceFromDb: Invoice;
  contractorToModified: ContractorDto;
  contractorFromDB: Contractor;
  sellerFromService: Seller;
  saveInvoiceWithContractor: boolean;
  private addressToModified: Address;
  private isCreated: boolean;
  private invoiceExist: boolean;
  private showNamePlaceholder: boolean;
  private showMethodOfPaymentPlaceholder: boolean;
  private showPaidPlaceholder: boolean;
  private showVATPlaceholder: boolean;
  rateOfExchangeInputIsHidden = true;
  modeCurrency = 'euro';
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




  constructor(private fb: FormBuilder, private checkboxservice: CheckboxService,
              private invoiceService: InvoiceService, private sellerService: SellerService,
              private contractorService: ContractorService, private productService: ProductService,
              private rateService: RateService, private datePipe: DatePipe,
              private decimal: DecimalPipe, private dialog: MatDialog,
              private userAuthService: UserAuthService) {

  }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      contractor: this.fb.group({
        nameInput: '',
        contractorSelect: '',
        vatIdentificationNumberInput: '',
        address: this.fb.group({
          streetInput: '',
          streetNumberInput: '',
          postcodeInput: '',
          cityInput: '',
          countryInput: 'Poland'

        })
      }),
      dates: this.fb.group({
        dateOfInvoiceInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')],
        dateOfSaleInput: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en')]
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
    this.addNextItem();
    this.checkTheChangeContractorName();
    this.sumGrossValue();
    this.sumNetValue();
    this.sellerFromService = this.sellerService.getSellerValue();
    console.log(this.sellerFromService);
  }



  addContratorFromTheCatalog() {
    this.checkedContractorList = this.checkboxservice.getContractorsFromTheCatalogMap();
    this.idContractorFromTheCatalog = this.checkedContractorList.keys().next().value;
    this.contractorService.getContractorById(this.idContractorFromTheCatalog).subscribe((contractorFromDb) => {
      this.myFormModel.get('contractor').get('nameInput').setValue(contractorFromDb.name);
      this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(contractorFromDb.vatIdentificationNumber);
      this.myFormModel.get('contractor').get('address').get('streetInput').setValue(contractorFromDb.address.street);
      this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(contractorFromDb.address.streetNumber);
      this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(contractorFromDb.address.postcode);
      this.myFormModel.get('contractor').get('address').get('cityInput').setValue(contractorFromDb.address.city);
      this.myFormModel.get('contractor').get('address').get('countryInput').setValue(contractorFromDb.address.country);
    });
  }

  addProductFromTheCatalog() {
    this.checkedProductsList = this.checkboxservice.getProductFromTheCatalogMap();
    this.idProductFromTheCatalog = this.checkedProductsList.keys().next().value;
    this.productService.getProductById(this.idProductFromTheCatalog).subscribe( (productFromDb) => {
      // this.myFormModel.get('item').get('numberInput').setValue(productFromDb.);
        this.myFormModel.get('items').value[this.numberOfItem].get('productInput').setValue(productFromDb.nameOfProduct);
    });
  }

  addContractorFromTheGus(nip: string) {
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
  }

  setDate() {
    this.datePipe = new DatePipe('en-US');
    const sub3 = this.myFormModel.valueChanges.subscribe(form => {
      const dateOfInvoiceInput = this.datePipe.transform(form.dateOfInvoiceInput, 'MM/dd/yyyy');
      this.myFormModel.get('dateOfInvoiceInput').patchValue(dateOfInvoiceInput);
      // tslint:disable-next-line:align
    });
    this.subscriptions.add(sub3);
  }


  setDateOfSale() {
    this.datePipe = new DatePipe('en-US');
    const sub4 = this.myFormModel.valueChanges.subscribe(form => {
      const dateOfSaleInput = this.datePipe.transform(form.dateOfSaleInput, 'MM/dd/yyyy');
      this.myFormModel.get('dateOfSaleInput').patchValue(dateOfSaleInput);
      // tslint:disable-next-line:align
    });
    this.subscriptions.add(sub4);
  }

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
    const isSelectedOne = this.invoicesMap.checkOrInvoicesMapEqualsOne();
    if (isSelectedOne) {
      this.idInvoice = this.invoicesMap.getInvoiceIdFromMap();
      this.invoiceService.getInvoiceById(this.idInvoice).subscribe((invoiceFromDb) => {
        this.invoiceToModified = invoiceFromDb;
        this.contractorToModified = invoiceFromDb.contractor;
        this.addressToModified = this.contractorToModified.address;
        const itemsGroup = invoiceFromDb.items.map(item => this.fb.group(item));
        this.myFormModel.get('contractor').get('nameInput').setValue(this.contractorToModified.name);
        this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(this.contractorToModified.vatIdentificationNumber);
        this.myFormModel.get('contractor').get('address').get('streetInput').setValue(this.addressToModified.street);
        this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(this.addressToModified.streetNumber);
        this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(this.addressToModified.postcode);
        this.myFormModel.get('contractor').get('address').get('cityInput').setValue(this.addressToModified.city);
        this.myFormModel.get('contractor').get('address').get('countryInput').setValue(this.addressToModified.country);
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
          this.items.at(index).get('productInput').setValue(product.nameOfProduct);
          this.items.at(index).get('unitInput').setValue(product.unit);
          this.items.at(index).get('amountInput').setValue(product.amount);
          this.items.at(index).get('netWorthInput').setValue(product.netWorth);
          this.items.at(index).get('vatRateInput').setValue(product.vatRate);
          this.items.at(index).get('grossValueInput').setValue(product.grossValue);
        });
      });
    }
    if (this.checkboxservice.lengthInvoicesMap() === 0) {
      alert('Check the box');
      this.isHidden = true;
    }
    if (this.checkboxservice.lengthInvoicesMap() > 1) {
      alert('More than one checkbox is selected, choose one');
      this.isHidden = true;
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


  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    console.log('zostałem zniszczony');
  }

  saveInvoice() {
    if (this.mode === 'edit') {
      this.changeInvoice();
    } else if (this.saveInvoiceWithContractor === false) {
      this.saveInvoiceWithoutContractor();
    } else {
      const invoice = this.setInvoiceWithContractor();
      this.setItems(invoice);
      this.invoiceService.saveInvoice(invoice).subscribe(saveInvoice => {
        if (saveInvoice !== undefined) {
          console.log(saveInvoice);
          this.isCreated = true;
          this.invoiceExist = false;
        }
        if (this.isCreated) {
          this.loadData.emit();
          this.loadPaymentData.emit();
          this.closeDialog();
        }
      }, (response: HttpErrorResponse) => {
        this.validationErrors = response.error;
        this.isCreated = false;
        console.log(response.error['contractorDto.name'][0]);
        console.log(response.error['contractorDto.vatIdentificationNumber'][0]);
        console.log(response.error['invoice.paid'][0]);
        console.log(response.error['invoice.dateOfSale'][0]);
        console.log(this.validationErrors);
      });

      // if (response.status === 403 || response.status === 401) {
      // alert('Function available only for the administrator');

    }
    // });
  }

  // tslint:disable-next-line:typedef
  private saveInvoiceWithoutContractor() {
    const invoice = this.setInvoiceWithoutContractor();
    this.setItems(invoice);
    this.invoiceService.saveInvoiceWithoutContractor(invoice).subscribe(saveInvoice => {
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
      console.log(response.error['contractorDto.name'][0]);
      console.log(this.validationErrors);
    });
  }


  // tslint:disable-next-line:typedef
  private changeInvoice() {
    const invoice = this.setInvoiceWithContractor();
    this.setItems(invoice);
    this.invoiceService.updateInvoice(invoice).subscribe(updateInvoice => {
      if (updateInvoice !== undefined) {
        this.isCreated = true;
      }
      if (this.isCreated) {
        this.loadData.emit();
        this.loadPaymentData.emit();
        this.closeDialog();
      }
    }, (response: HttpErrorResponse) => {
      this.validationErrors = response.error;
      this.isCreated = false;
      /* if (response.status === 403 || response.status === 401) {
         alert('Function available only for the administrator');
       }*/
    });
  }

  public setInvoiceWithContractor(): Invoice {
    const invoice: Invoice = {
      id: this.mode === 'edit' ? this.idInvoice : null,
      contractor: {
        id: null,
        name: this.myFormModel.get('contractor').get('nameInput').value,
        vatIdentificationNumber: this.myFormModel.get('contractor').get('vatIdentificationNumberInput').value,
        address: {
          id: null,
          street: this.myFormModel.get('contractor').get('address').get('streetInput').value,
          streetNumber: this.myFormModel.get('contractor').get('address').get('streetNumberInput').value,
          postcode: this.myFormModel.get('contractor').get('address').get('postcodeInput').value,
          city: this.myFormModel.get('contractor').get('address').get('cityInput').value,
          country: this.myFormModel.get('contractor').get('address').get('countryInput').value
        }
      },
      seller: {
        id: null,
        name: this.sellerFromService.name,
        vatIdentificationNumber: this.sellerFromService.vatIdentificationNumber,
      },
      dateOfInvoice: this.myFormModel.get('dates').get('dateOfInvoiceInput').value,
      dateOfSale: this.myFormModel.get('dates').get('dateOfSaleInput').value,
      periodOfPayment: this.myFormModel.get('payments').get('periodOfPaymentInput').value,
      methodOfPayment: this.myFormModel.get('payments').get('methodOfPaymentInput').value,
      paid: this.myFormModel.get('payments').get('paidInput').value,
      rate: {
        id: null,
        currency: this.myFormModel.get('rate').get('currencyInput').value,
        rateOfExchange: this.myFormModel.get('rate').get('rateOfExchangeInput').value,
      },
      items: [],
      netAmount: this.myFormModel.get('netAmountInput').value,
      sumTotal: this.myFormModel.get('sumTotalInput').value
    };
    return invoice;
  }

  private setInvoiceWithoutContractor() {
    const invoice: Invoice = {
      id: null,
      seller: {
        id: null,
        name: this.sellerFromService.name,
        vatIdentificationNumber: this.sellerFromService.vatIdentificationNumber,
      },
      dateOfInvoice: this.myFormModel.get('dates').get('dateOfInvoiceInput').value,
      dateOfSale: this.myFormModel.get('dates').get('dateOfSaleInput').value,
      periodOfPayment: this.myFormModel.get('payments').get('periodOfPaymentInput').value,
      methodOfPayment: this.myFormModel.get('payments').get('methodOfPaymentInput').value,
      paid: this.myFormModel.get('payments').get('paidInput').value,
      rate: {
        id: null,
        currency: this.myFormModel.get('rate').get('currencyInput').value,
        rateOfExchange: this.myFormModel.get('rate').get('rateOfExchangeInput').value,
      },
      items: [],
      netAmount: this.myFormModel.get('netAmountInput').value,
      sumTotal: this.myFormModel.get('sumTotalInput').value
    };
    return invoice;
  }

  setItems(invoice) {
    this.items.controls.forEach((productControl, index) => {
      const item: Item = {
        id: null,
        number: productControl.get('numberInput').value,
        nameOfProduct: productControl.get('productInput').value,
        unit: productControl.get('unitInput').value,
        amount: productControl.get('amountInput').value,
        netWorth: productControl.get('netWorthInput').value,
        vatRate: productControl.get('vatRateInput').value,
        grossValue: productControl.get('grossValueInput').value,
      };
      invoice.items.push(item);
    });
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

  saveNumber(numberItem) {
    this.number = numberItem;
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
    this.myFormModel.get('contractor').get('nameInput').valueChanges.subscribe(
      response => this.filterContractor(response)
    );
  }

  // tslint:disable-next-line:typedef
  private filterContractor(response) {
    this.contractorService.getBuyerWithSpecifiedName(response).subscribe(contractors => {
      // tslint:disable-next-line:no-shadowed-variable
      this.filteredName = contractors.map(buyer => buyer.name);
      this.contractors = contractors;
    });
    if (this.contractorFormIsHidden) {
      this.contractorFormIsHidden = !this.contractorFormIsHidden;
    }
    const name = this.myFormModel.get('contractor').get('nameInput').value;
    if (this.filteredName.find(e => e === name)) {
      if (this.isCloseButtonHidden) {
        this.isCloseButtonHidden = !this.isCloseButtonHidden;
      }
      this.contractorWithName = this.contractors.filter(contractor => contractor.name === name).pop();
      this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(this.contractorWithName.vatIdentificationNumber);
      this.myFormModel.get('contractor').get('address').get('streetInput').setValue(this.contractorWithName.address.street);
      this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(this.contractorWithName.address.streetNumber);
      this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(this.contractorWithName.address.postcode);
      this.myFormModel.get('contractor').get('address').get('cityInput').setValue(this.contractorWithName.address.city);
      this.myFormModel.get('contractor').get('address').get('countryInput').setValue(this.contractorWithName.address.country);
    } else {
      this.contractorFormIsHidden = false;
    }
  }


  /*getContractorByName(name) {
   // const subscribtion4 =
     return this.contractorService.getContractorByName(name).subscribe((contractorFromDb) => {  }
    });

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


  /*toggleDateOfIssuePlaceholder() {
    this.showDateOfIssuePlaceholder = (this.myFormModel.get('dateOfInvoiceInput').value === '');
  }

  toggleDateOfSalePlaceholder() {
    this.showDateOfSalePlaceholder = (this.myFormModel.get('dateOfSaleInput').value === '');
  }*/



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


  closeDialog(): void {
    this.isHidden = true;
    this.clearInvoiceForm();
    this.clearValidationErrors();
    this.checkboxservice.removeFromInvoicesMap(this.checkboxOfInvoice);
  }

  private clearInvoiceForm() {
    this.clearContractorForm();
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


  openDialog(mode: string, numberOfItem: number) {
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
    /*gusDialogConfig.position = {
      top: '0px',
      bottom: '150px',
      left: '1200px',
      right: '1000px'
    };*/
    if (mode === 'catalogOfContractors') {
      this.dialog.open(ContractorsCatalogComponent, dialogConfig);
      this.contractorCatalog.showContractorCatalog();
    }
    if (mode === 'gus') {
      this.dialog.open(GusContractorComponent, gusDialogConfig);
      this.contractorFromGus.showContractorForm();
    }
    if (mode === 'catalogOfProducts') {
      this.dialog.open(ProductsCatalogComponent, dialogConfig);
      this.productsCatalog.showProductCatalog();
    }
    /*if (mode === 'addProduct') {
      this.dialog.open(AddProductComponent, gusDialogConfig);
      this.contractorFromGus.showContractorForm();
    }*/
  }

  deleteDateFromForm() {
    this.clearContractorForm();
    if (!this.contractorFormIsHidden) {
      this.contractorFormIsHidden = true;
    }
    if (!this.isCloseButtonHidden) {
      this.isCloseButtonHidden = true;
    }
  }


  clearContractorForm() {
    this.myFormModel.get('contractor').get('nameInput').setValue(''),
      this.myFormModel.get('contractor').get('vatIdentificationNumberInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('streetInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('streetNumberInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('postcodeInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('cityInput').setValue(''),
      this.myFormModel.get('contractor').get('address').get('countryInput').setValue('');
  }


  savingChanges(contractorInput: HTMLInputElement) {
    if (contractorInput.checked) {
      this.saveInvoiceWithContractor = true;
    } else {
      this.saveInvoiceWithContractor = false;
    }
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



}


