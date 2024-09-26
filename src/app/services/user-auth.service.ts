import { Injectable } from '@angular/core';

import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {NewUserDto} from '../models-interface/newUserDto';
import {UserDto} from '../models-interface/userDto';
import {Token} from '../models-interface/token';
import {HttpService} from './http.service';
import {map, timeout} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthTokenInterceptor} from '../interceptors/auth-token-interceptor';
import {UserProfile} from '../models-interface/user-profile';
import {SellerService} from './seller.service';
import {Seller} from '../models-interface/seller';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpService: HttpService, private sellerService: SellerService) {}
  token$ = new BehaviorSubject<string>(null);
  userdata: UserProfile;
  refreshtoken$ = new BehaviorSubject<string>(null);
  isloggedin$ = new BehaviorSubject<boolean>(false);
  userProfile$ = new BehaviorSubject<Array<string>>([]);
  userName$ = new BehaviorSubject<string>(null);
  userPassword$ = new BehaviorSubject<string>(null);
  jwtHelper = new JwtHelperService();
  private timeoutId;
  private isLoading = false;


  /*public async getTokenFromService(): Promise<Observable<string>> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const newToken = localStorage.getItem('new_token');

    let tokenToUse: string | null;

    if (accessToken) {
      tokenToUse = accessToken;
      AuthTokenInterceptor.refresh = false;
    } else if (refreshToken) {
      tokenToUse = refreshToken;
    } else if (newToken) {
      tokenToUse = newToken;
      AuthTokenInterceptor.refresh = true;
    }

    if (tokenToUse) {
      const userData = this.jwtHelper.decodeToken(tokenToUse) as UserProfile;
      this.setTokenData(userData);
      await this.setSellerData(userData.sub);
      this.token$.next(tokenToUse);

      AuthTokenInterceptor.accessToken = accessToken || newToken || '';
      AuthTokenInterceptor.refreshToken = refreshToken || '';


      console.log(tokenToUse);

      return Promise.resolve(this.token$.asObservable());
    } else {
      console.log('Access denied, you have to log in');
      return Promise.resolve(this.token$.asObservable());
    }
  }

  public async getTokenFromService(): Promise<Observable<string>>  {
    const accesstoken = localStorage.getItem('access_token');
    const refreshtoken = localStorage.getItem('refresh_token');
    const newtoken = localStorage.getItem('new_token');
    const sellerName = localStorage.getItem('currentSeller');
    if (accesstoken !== null && accesstoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(accesstoken) as UserProfile;
      this.setTokenData(userdata);
      await this.setSellerData(userdata.sub);
      this. token$.next(accesstoken);
      AuthTokenInterceptor.refresh = false;
      AuthTokenInterceptor.accessToken = accesstoken;
      AuthTokenInterceptor.refreshToken = refreshtoken;
      console.log(accesstoken);
      return Promise.resolve(this.token$.asObservable());
    }

    if (refreshtoken !== null && refreshtoken !== undefined) {
      // tslint:disable-next-line:no-shadowed-variable
      const userdata = this.jwtHelper.decodeToken(refreshtoken) as UserProfile;
      this.setTokenData(userdata);
      await this.setSellerData(userdata.sub);
      this.token$.next(refreshtoken);
      AuthTokenInterceptor.refreshToken = refreshtoken;
      console.log(refreshtoken);
      return Promise.resolve(this.token$.asObservable());
    }
    if (newtoken !== null && newtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(newtoken) as UserProfile;
      this.setTokenData(userdata);
      await this.setSellerData(userdata.sub);
      this.token$.next(newtoken);
      AuthTokenInterceptor.accessToken = newtoken;
      AuthTokenInterceptor.refresh = true;
      console.log(newtoken);
      return Promise.resolve(this.token$.asObservable());
    } else {
      console.log('Access denied, you have to log in');
    }
  }*/

  setTokenData(userdata) {
    const userrole = userdata.role;
    this.userProfile$.next(userrole);

    this.isloggedin$.next(true);
    const username = userdata.sub;
    this.userName$.next(username);
  }


  public async getTokenFromService(): Promise<Observable<string>> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const newToken = localStorage.getItem('new_token');

    let tokenToUse: string | null = this.getValidToken(accessToken, refreshToken, newToken);

    if (tokenToUse) {
      const userData = this.jwtHelper.decodeToken(tokenToUse) as UserProfile;
      this.setTokenData(userData);
      await this.setSellerData(userData.sub);

      this.token$.next(tokenToUse);
      this.updateInterceptorTokens(accessToken, refreshToken, newToken);

      console.log(tokenToUse);
      return Promise.resolve(this.token$.asObservable());
    } else {
      this.isloggedin$.next(false);
      console.log('Access denied, you have to log in');
      return Promise.resolve(this.token$.asObservable());
    }
  }

  private getValidToken(accessToken: string | null, refreshToken: string | null, newToken: string | null): string | null {
    if (accessToken) { return accessToken; }
    if (refreshToken) { return refreshToken; }
    if (newToken) { return newToken; }
    return null;
  }

  private updateInterceptorTokens(accessToken: string | null, refreshToken: string | null, newToken: string | null): void {
    if (accessToken) {
      AuthTokenInterceptor.refresh = false;
      AuthTokenInterceptor.accessToken = accessToken;
    }
    if (refreshToken) {
      AuthTokenInterceptor.refreshToken = refreshToken;
    }
    if (newToken) {
      AuthTokenInterceptor.accessToken = newToken;
      AuthTokenInterceptor.refresh = true;
    }
  }



  public async setSellerData(username: string): Promise<void> {
    const currentSeller = this.sellerService.getSellerValue();
    const cachedSellerName = localStorage.getItem('currentSeller');

    if (currentSeller !== undefined && currentSeller !== null) {
      console.log(currentSeller);
      return;
    }

    if (cachedSellerName !== null) {
      this.sellerService.currentSeller$.next({ name: cachedSellerName } as Seller);
      return;
    }

    if (this.isLoading) {
     return;
    }
    this.isLoading = true;

    try {
      const sellerByAppUser: Seller = await firstValueFrom(this.sellerService.getSellerByAppUser(username));
      if (sellerByAppUser) {
        this.sellerService.currentSeller$.next(sellerByAppUser);
        console.log(sellerByAppUser);
        localStorage.setItem('currentSeller', sellerByAppUser.name);
      }
    } catch (error) {
      console.error('Error fetching seller:', error);
    } finally {
      this.isLoading = false;
    }
}







  login(userDto: UserDto): Observable<any> {
   return this.httpService.generateToken(userDto)
      .pipe(
        map( async (response) => {
          //this.userName$.next(userDto.username);
          this.userPassword$.next(userDto.password);
          const tokens = response as unknown as Token;
          localStorage.setItem('username', userDto.username);
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          AuthTokenInterceptor.accessToken = tokens.access_token;
          AuthTokenInterceptor.refreshToken = tokens.refresh_token;
          AuthTokenInterceptor.isLogout = false;
          const userdata = this.jwtHelper.decodeToken(tokens.access_token) as UserProfile;
          this.setTokenData(userdata);
          this.token$.next(tokens.access_token);
          return true;
        }));
   }


   getUsernameAsObervable() {
     return this.userName$.asObservable();
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





}

