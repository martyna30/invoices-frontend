import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Invoice} from '../models-interface/invoice';
import {Product} from '../models-interface/product';
import {ProductService} from '../services/product.service';
import {CheckboxService} from '../services/checkbox.service';
import {CheckStatusComponent} from '../checkStatusComponent/check-status/check-status.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddInvoiceComponent} from '../invoices/add-invoice/add-invoice.component';
import {AddProductComponent} from './add-product/add-product.component';



const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('checkStatusDataRef')
  checkStatusComponent: CheckStatusComponent;
  @ViewChild('childAddRef')
  addProductComponent: AddProductComponent;
  productsList$: Observable<Array<Product>>;
  isDisabled: false;
  page = 1;
  size = 10;
  total: Observable<number>;
  isHidden = true;
  private productIdFromMap: number;
  private checkbox: number;



  constructor(private dialog: MatDialog, private productService: ProductService,
              private checkboxService: CheckboxService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.checkStatusComponent.checkStatus();
  }


  openDialog(mode: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mode;
    dialogConfig.panelClass = 'custom-modalbox';
    this.dialog.open(AddInvoiceComponent, dialogConfig);
    if (mode === 'edit') {
      this.addProductComponent.showEditProductForm();
    } else {
      this.addProductComponent.showAddProductForm();
    }
  }


  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    console.log(this.page);
    this.loadData();
  }

  // tslint:disable-next-line:typedef
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  loadPage(page: any) {
    console.log(page);
    if (page !== 1) {
      this.page = page;
      console.log(page);
      this.loadData();
    }
  }

  // tslint:disable-next-line:typedef
  loadData() {
    this.isHidden = !this.isHidden;
    const page = this.page - 1;
    this.productService.getProductsListObservable(page, this.size);
    this.productsList$ = this.productService.getProductsFromService();
    // @ts-ignore
    this.total = this.productService.getTotalCountProducts();
    if (this.checkboxService.lengthProductsMap() > 0) {
      this.productIdFromMap = this.checkboxService.getProductMap().keys().next().value;
      this.checkboxService.removeFromProductsMap(this.productIdFromMap);
    }
  }

  // tslint:disable-next-line:typedef

  changeCheckboxList(checkbox: HTMLInputElement) {
    if (checkbox.checked) {
      this.checkbox = Number(checkbox.value);
      this.checkboxService.addToProductsMap(Number(this.checkbox));
    } else {
      this.checkboxService.removeFromProductsMap(Number(this.checkbox));
    }
  }

  getColor() {

  }

  deleteProduct() {

  }

  acceptProduct() {

  }
}
