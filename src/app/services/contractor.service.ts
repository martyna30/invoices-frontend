import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Invoice} from '../models-interface/invoice';
import {ContractorsComponent} from '../contractors/contractors.component';
import {Contractor} from '../models-interface/contractor';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {

  private contractorsListObs$ = new BehaviorSubject<Array<Contractor>>([]);
  private totalCountContractors$ = new BehaviorSubject<number>(0);

  constructor(private httpService: HttpService) {
    this.getContractorsFromService();
  }

  getContractorsListObservable(page: number, size: number) {
    this.httpService.getContractors(page, size).subscribe((listContractors) => {
      this.contractorsListObs$.next(listContractors.contractors);
      this.totalCountContractors$.next(listContractors.total);
    });
  }

  getBuyerWithSpecifiedName(name: string) {
     return this.httpService.getBuyerWithSpecifiedName(name);
  }

  getContractorsFromService(): Observable<Array<Contractor>> {
    return this.contractorsListObs$.asObservable();
  }

  getContractorById(idContractor: number): Observable<Contractor> {
    return this.httpService.getContractorById(idContractor);
  }

  getContractorByName(name: string) {
    return this.httpService.getContractorByName(name);
  }


  saveContractor(contractor: Contractor): Observable<Contractor> {
    return this.httpService.saveContractor(contractor);
  }
  // tslint:disable-next-line:typedef
  updateContractor(contractor: Contractor) {
    return this.httpService.updateContractor(contractor);
  }

  getTotalCountContractors(): Observable<number> {
    return this.totalCountContractors$.asObservable();
  }

  deleteContractor(contractorId: number) {
    return this.httpService.deleteContractor(contractorId);
  }
}
