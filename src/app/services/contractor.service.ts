import { Injectable } from '@angular/core';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  constructor(private httpService: HttpService) { }

  getBuyerWithSpecifiedName(name: string) {
     return this.httpService.getBuyerWithSpecifiedName(name);
  }
}
