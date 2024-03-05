import { Injectable } from '@angular/core';
import {Invoice} from '../models-interface/invoice';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';
import {Payment} from '../models-interface/payment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpService: HttpService) { }

}
