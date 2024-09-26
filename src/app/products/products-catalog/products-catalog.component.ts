import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {CheckboxService} from '../../services/checkbox.service';
import {ProductService} from '../../services/product.service';

const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-products-catalog',
  templateUrl: './products-catalog.component.html',
  styleUrls: ['./products-catalog.component.scss']
})
export class ProductsCatalogComponent implements OnInit {
  @Output()
  addProductFromTheCatalog = new EventEmitter<unknown>();
  productsList$: null;
  productsCatalogIsHidden = true;
  isDisabled: false;
  page = 1;
  size = 10;
  total: Observable<number>;
  private checkbox: number;
  private productIdFromCatalogMap: number;

  constructor(private checkboxService: CheckboxService,
              private productService: ProductService ) { }

  ngOnInit(): void {
  }

  showProductCatalog() {
    if (this.productsCatalogIsHidden) {
      this.productsCatalogIsHidden = !this.productsCatalogIsHidden;
    } else {
      this.productsCatalogIsHidden = true;
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

  choose() {
    if (this.checkboxService.lengthProductsFromTheCatalogMap() === 1) {
      this.addProductFromTheCatalog.emit();
      this.closeDialog();
      return;
    }
    if (this.checkboxService.lengthProductsFromTheCatalogMap() === 0) {
      alert('Check the box');
    }
    if (this.checkboxService.lengthProductsFromTheCatalogMap() > 1) {
      alert('More than one checkbox is selected, choose one');
    }
  }


  loadData() {
    const page = this.page - 1;
    this.productService.getProductsListObservable(page, this.size);
    this.productsList$ = this.productService.getProductsFromService();
    this.total = this.productService.getTotalCountProducts();
    if (this.checkboxService.lengthProductsFromTheCatalogMap() > 0) {
      this.productIdFromCatalogMap = this.checkboxService.
      getProductFromTheCatalogMap().keys().next().value;
      this.checkboxService.removeProductsFromTheCatalogMap(this.productIdFromCatalogMap);
    }
  }



  closeDialog(): void {
    this.checkboxService.removeProductsFromTheCatalogMap(this.checkbox);
    this.productsCatalogIsHidden = true;
  }

  changeCheckboxList(checkbox: HTMLInputElement) {
    if (checkbox.checked) {
      this.checkbox = Number(checkbox.value);
      this.checkboxService.addToProductsFromTheCatalogMap(Number(this.checkbox));
    } else {
      this.checkboxService.removeProductsFromTheCatalogMap(Number(this.checkbox));
    }
  }

  getColor() {

  }
}
