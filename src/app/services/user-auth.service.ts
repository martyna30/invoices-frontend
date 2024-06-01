import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {NewUserDto} from '../models-interface/newUserDto';
import {UserDto} from '../models-interface/userDto';
import {Token} from '../models-interface/token';
import {HttpService} from './http.service';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthTokenInterceptor} from '../interceptors/auth-token-interceptor';
import {UserProfile} from '../models-interface/user-profile';
import {SellerService} from './seller.service';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpService: HttpService, private sellerService: SellerService) {}
  token$ = new BehaviorSubject<string>(null);

  refreshtoken$ = new BehaviorSubject<string>(null);
  isloggedin$ = new BehaviorSubject<boolean>(false);
  userProfile$ = new BehaviorSubject<Array<string>>([]);
  userName$ = new BehaviorSubject<string>(null);
  userPassword$ = new BehaviorSubject<string>(null);
  jwtHelper = new JwtHelperService();

  public getTokenFromService(): Observable<string> {
    const accesstoken = localStorage.getItem('access_token');
    const refreshtoken = localStorage.getItem('refresh_token');
    const newtoken = localStorage.getItem('new_token');
    const currentSeller = localStorage.getItem('currentSeller');
    if (accesstoken !== null && accesstoken !== undefined) {

      const userdata = this.jwtHelper.decodeToken(accesstoken) as UserProfile;
      this.getSellerData(currentSeller, userdata.sub);
      this.setTokenData(userdata);


      this.token$.next(accesstoken);
      AuthTokenInterceptor.refresh = false;
      AuthTokenInterceptor.accessToken = accesstoken;
      AuthTokenInterceptor.refreshToken = refreshtoken;
      return this.token$.asObservable();
    }

    if (refreshtoken !== null && refreshtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(refreshtoken) as UserProfile;
      this.getSellerData(currentSeller, userdata.sub);
      this.setTokenData(userdata);

      this.token$.next(refreshtoken);
      AuthTokenInterceptor.refreshToken = refreshtoken;
      return this.token$.asObservable();
    }
    if (newtoken !== null && newtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(newtoken) as UserProfile;
      this.getSellerData(currentSeller, userdata.sub);
      this.setTokenData(userdata);
      this.token$.next(newtoken);
      AuthTokenInterceptor.accessToken = newtoken;
      AuthTokenInterceptor.refresh = true;
      return this.token$.asObservable();
    }
    else {
     console.log('Access denied, you have to log in');
    }
  }

  setTokenData(userdata) {
    const userrole = userdata.role;
    this.userProfile$.next(userrole);
    const username = userdata.sub;
    this.userName$.next(username);
   // this.getCurrentSellerData(currentSeller, username);
    this.isloggedin$.next(true);
   // return;
  }

  getSellerData(currentSeller: string, username: string) {
    if (currentSeller !== null && currentSeller !== undefined) {
      this.sellerService.getSellerByName(currentSeller).subscribe( seller => {
        this.sellerService.currentSeller$.next(seller);
      });
    } else {
      this.sellerService.getSellerByAppUser(username);
    }
  }



  login(userDto: UserDto): Observable<any> {
    return this.httpService.generateToken(userDto)
      .pipe(
        map((response) => {
          this.isloggedin$.next(true);
          this.userName$.next(userDto.username);
          this.sellerService.getSellerByAppUser(userDto.username);
          this.userPassword$.next(userDto.password);
          const tokens = response as unknown as Token;
          localStorage.setItem('username', userDto.username);
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          AuthTokenInterceptor.accessToken = tokens.access_token;
          AuthTokenInterceptor.refreshToken = tokens.refresh_token;
          AuthTokenInterceptor.isLogout = false;
          const userdata = this.jwtHelper.decodeToken(tokens.access_token) as UserProfile;
          const userrole = userdata.role;
          this.token$.next(tokens.access_token);
          this.userProfile$.next(userrole);
          return true;
        }));
  }

  getUsernameForLoggedInUser(): string {
    return this.userName$.value;
  }


  register(user: NewUserDto): Observable<NewUserDto> {
    this.userName$.next(user.username);
    return this.httpService.register(user);
  }

  logout() {
    return this.httpService.logout().subscribe(res => {
        this.userName$.next(null);
        this.token$.next(null);
        this.userProfile$.next(null);
        this.isloggedin$.next(false);
        localStorage.removeItem('new_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('currentSeller');
        localStorage.removeItem('borrowedBooks');
    });
  }


  getUserByUsername(loggedInUsername: string) {
    return this.httpService.getUserByUsername(loggedInUsername);
  }
}

