import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CheckboxService {

  private invoicesMap = new Map<number, number>();
  private contractorsMap = new Map<number, number>();
  private contractorsFromTheCatalogMap = new Map<number, number>();
  private paymentsMap = new Map<number, number>();
  private productsMap = new Map<number, number>();
  private productsFromTheCatalogMap = new Map<number, number>();

  getInvoicesMap(): Map<number, number> {
    return this.invoicesMap;
  }

  addToInvoicesMap(id: number): void {
    this.invoicesMap.set(id, 1);
  }

  removeFromInvoicesMap(id: number): void {
    this.invoicesMap.delete(id);
  }

  lengthInvoicesMap(): number {
    return this.invoicesMap.size;
  }

  getContractorsMap(): Map<number, number> {
    return this.contractorsMap;
  }

  addToContractorsMap(id: number) {
    this.contractorsMap.set(id, 1);
  }

  removeFromContractorsMap(id: number) {
    this.contractorsMap.delete(id);
  }

  lengthContractorsMap() {
    return this.contractorsMap.size;
  }

  getContractorsFromTheCatalogMap(): Map<number, number> {
    return this.contractorsFromTheCatalogMap;
  }

  addToContractorsFromTheCatalogMap(id: number) {
    this.contractorsFromTheCatalogMap.set(id, 1);
  }

  removeFromContractorsFromTheCatalogMap(id: number) {
    this.contractorsFromTheCatalogMap.delete(id);
  }

  lengthContractorsFromTheCatalogMap() {
    return this.contractorsFromTheCatalogMap.size;
  }


  getPaymentsMap(): Map<number, number> {
    return this.paymentsMap;
  }

  addToPaymentsMap(id: number): void {
    this.paymentsMap.set(id, 1);
  }

  removeFromPaymentsMap(id: number): void {
    this.paymentsMap.delete(id);
  }

  lengthPaymentsMap(): number {
    return this.paymentsMap.size;
  }

  getProductMap(): Map<number, number> {
    return this.productsMap;
  }

  addToProductsMap(id: number) {
    this.productsMap.set(id, 1);
  }

  removeFromProductsMap(id: number) {
    this.productsMap.delete(id);
  }

  lengthProductsMap() {
    return this.productsMap.size;
  }


  getProductFromTheCatalogMap(): Map<number, number> {
    return this.productsFromTheCatalogMap;
  }

  addToProductsFromTheCatalogMap(id: number) {
    this.productsFromTheCatalogMap.set(id, 1);
  }

  removeProductsFromTheCatalogMap(id: number) {
    this.productsFromTheCatalogMap.delete(id);
  }

  lengthProductsFromTheCatalogMap() {
    return this.productsFromTheCatalogMap.size;
  }




}

