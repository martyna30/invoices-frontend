import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CheckboxService} from '../../services/checkbox.service';
import {ProductService} from '../../services/product.service';
import {ProductValidationErrors} from '../../models-interface/productValidationErrors';
import {Product} from '../../models-interface/product';
import {finalize, Observer, of, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  myFormModel: FormGroup;
  isHidden = true;
  private mode: string;
  validationErrors: ProductValidationErrors;
  private checkbox: number;
  private isCreated: boolean;
  private idProduct: number;
  typeProduct = 'commodity';
  StocksOfProductIsHidden = false;
  unitProduct = 'pc';
  vatValue = '23';



  constructor(
    private fb: FormBuilder, private checkboxservice: CheckboxService ,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      nameOfProductInput: '',
      typeInput: this.typeProduct,
      unitInput: this.unitProduct,
      codeInput: '',
      netWorthInput: '',
      vatRateInput: this.vatValue,
      grossValueInput: ''
    });

  }

  showAddProductForm() {
    this.mode = 'add';
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  showEditProductForm() {
    this.mode = 'edit';
    this.isHidden = false;
    if (this.checkboxservice.lengthProductsMap() === 1) {
     const idProduct = this.checkboxservice.getProductMap().keys().next().value;
     this.productService.getProductById(idProduct).subscribe((productFromDb) => {
       this.myFormModel.get('nameOfProductInput').setValue(productFromDb.nameOfProduct);
       this.myFormModel.get('nameOfProductInput').setValue(productFromDb.nameOfProduct);

      });
    }
}

  closeDialog(): void {
    this.isHidden = true;
    this.clearProductForm();
    this.checkboxservice.removeFromProductsMap(this.checkbox);
  }

  saveProduct() {
    const product = this.setProduct();
    const operation = this.mode === 'edit'
      ? this.productService.updateProduct(product)
      : this.productService.saveProduct(product);

    operation.subscribe((response: any) => {
      if (response !== null && response !== undefined) {
        this.isCreated = true;
        this.loadData.emit();
        this.closeDialog();
      }
      catchError(err => {
          console.error('Wystąpił błąd', err);
          if (err instanceof HttpErrorResponse) {
            this.validationErrors = err.error;
            this.isCreated = false;
            return of(null);
          }
        });
    });
  }


  private clearProductForm() {
    this.myFormModel.get('nameOfProductInput').setValue('');
  }


  private setProduct() {
    const product: Product = {
      id: this.mode === 'edit' ? this.idProduct : null,
      nameOfProduct:  this.myFormModel.get('nameOfProductInput').value,
      type: this.myFormModel.get('typeInput').value,
      unit: this.myFormModel.get('unitInput').value,
      code: this.myFormModel.get('codeInput').value,
      netWorth: this.myFormModel.get('netWorthInput').value,
      vatRate: this.myFormModel.get('vatRateInput').value,
      grossValue: this.myFormModel.get('grossValueInput').value,
    };
    return product;
  }


  toggleStocksOfProduct(option: string) {
    if (option !== this.typeProduct) {
      this.StocksOfProductIsHidden = true;
    }
  }

  /*setGrossValue(vatRate: string) {
    const netWorth = this.myFormModel.get('netWorthInput').value;
    const grossNewValue = (+vatRate / +100) * +netWorth + +netWorth;
    const grossNewValueFloatRound = parseFloat(String(grossNewValue)).toFixed(2);
    const grossValueControl = this.myFormModel.get('grossValueInput').value;
    grossValueControl.patchValue(grossNewValueFloatRound);
  }*/



  setGrossValue(vatRate: string) {
    const netWorth = +this.myFormModel.get('netWorthInput').value;
    const grossNewValue = (parseFloat(vatRate) / 100) * netWorth + netWorth;
    if (isNaN(netWorth) || isNaN(parseFloat(vatRate))) {
      return; // Zakończ, jeśli wartość jest nieprawidłowa
    }
    // Pobierz kontrolkę formularza i zaktualizuj jej wartość
    const grossValueControl = this.myFormModel.get('grossValueInput');
    grossValueControl.patchValue(grossNewValue.toFixed(2)); // Ustawienie wartości z 2 miejscami po przecinku
  }
}





