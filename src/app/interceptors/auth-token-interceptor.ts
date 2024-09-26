import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EventEmitter, Injectable, Injector, Input, Output} from '@angular/core';
import {Token} from '../models-interface/token';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';


import {JwtHelperService} from '@auth0/angular-jwt';

import {A} from '@angular/cdk/keycodes';
import {getToken} from 'codelyzer/angular/styles/cssLexer';
import {UserDto} from '../models-interface/userDto';
import {UserAuthService} from '../services/user-auth.service';
import {UserProfile} from '../models-interface/user-profile';


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private http: HttpClient, private userAuthService: UserAuthService,
              private jwtHelper: JwtHelperService) {
  }
  static accessToken = '';
  static refreshToken = '';

  static userdata: UserDto;

  static refresh = false;

  static isLogout = false;




  // tslint:disable-next-line:typedef
  intercept(request, next) {
    const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
        }
      });

      return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        if ((err.status === 403 || err.status === 401) && !AuthTokenInterceptor.refresh) {


          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken !== null && refreshToken !== undefined) {
            const refresh = this.jwtHelper.decodeToken(refreshToken) as UserProfile;
            const exp = refresh.exp;
            const refreshExpired = (Date.now() >= exp * 1000);
            if (!refreshExpired) {
              AuthTokenInterceptor.accessToken = AuthTokenInterceptor.refreshToken;
              localStorage.removeItem('access_token');
              return this.http.post('http://localhost:8080/v1/invoice/token/refresh', {}, {}).pipe(
                switchMap((res: any) => {
                  const newtoken = res as Token;
                  AuthTokenInterceptor.refresh = true;
                  AuthTokenInterceptor.accessToken = newtoken.access_token;
                  localStorage.setItem('new_token', newtoken.access_token);
                  this.userAuthService.token$.next(newtoken.access_token);
                  localStorage.removeItem('refresh_token');
                  return next.handle(request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
                    }
                  }));
                })
              );

            }
            if (refreshExpired && (err.status === 403 || err.status === 401) && !AuthTokenInterceptor.isLogout) {
              AuthTokenInterceptor.isLogout = true;
              AuthTokenInterceptor.accessToken = '';
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              return this.userAuthService.logout();
            }
          }
        }
        if ((err.status === 403 || err.status === 401) && AuthTokenInterceptor.refresh === true) {
          const newToken = localStorage.getItem('new_token');
          if (newToken !== null && newToken !== undefined) {
            const newtoken = this.jwtHelper.decodeToken(AuthTokenInterceptor.accessToken) as UserProfile;
            // tslint:disable-next-line:no-shadowed-variable
            const newTokenExp = newtoken.exp;
            const newTokenExpired = (Date.now() >= newTokenExp * 1000);
            if (!newTokenExpired) {
              return next.handle(req);
            } else if (newTokenExpired && !AuthTokenInterceptor.isLogout) {
              AuthTokenInterceptor.isLogout = true;
              AuthTokenInterceptor.accessToken = '';
              localStorage.removeItem('new_token');
              return this.userAuthService.logout();
            }
          }
        }
        if (err.status === 422 ) {
            return next.handle(req);
        }
        if ( (err.status === 403 || err.status === 401) && AuthTokenInterceptor.isLogout) {
            return next.handle(req);
        }
        if (err.status === 201 || err.status === 200) {
          return next.handle(req);
        }
        // this.refresh = false;
        return throwError(() => err);
      }));
    }
  }


