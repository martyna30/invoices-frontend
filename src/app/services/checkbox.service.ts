import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CheckboxService {

  private invoicesMap = new Map<number, number>();

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


}

