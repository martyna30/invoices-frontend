import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {Observable, tap} from 'rxjs';
import {SettingsComponent} from '../../settings/settings.component';

@Component({
  selector: 'app-check-status',
  templateUrl: './check-status.component.html',
  styleUrls: ['./check-status.component.scss']
})
export class CheckStatusComponent implements OnInit {
  @Output()
  loadData: EventEmitter<any> = new EventEmitter<any>();
  // private isHidden = true;


  constructor(private userAuthService: UserAuthService) {
  }

  ngOnInit(): void {}

  checkStatusObservable() {
    return this.userAuthService.isloggedin$.asObservable();
  }

  checkStatus() {
    const isloggedin = this.userAuthService.isloggedin$.getValue() === true;
    if (isloggedin) {
      this.loadData.emit();
    }
    else if (!isloggedin) {
      console.log('Access denied, you have to log in');
    }
  }

  /*showData() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
      return false;
    } else {
      this.isHidden = true;
      return true;
    }
  }*/


  getUsername() {
    return this.userAuthService.userName$.asObservable();
  }


}


