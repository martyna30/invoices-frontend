import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Rate} from '../models-interface/rate';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private rate$ = new BehaviorSubject<Rate>(null);

  constructor(private httpService: HttpService) { }

  public getRateByCurrencyAndEffectiveDate(currency: string, date: Date) {
    this.httpService.getRateByCurrency(currency, date).subscribe(rate => {
      this.rate$.next(rate);
    });
  }

  getRateFromService(): Observable<Rate> {
    return this.rate$.asObservable();
  }
}
