import { AuthUrls } from '../../model/config-model/auth-url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { CurrentUser, LoginUser, TokenResponse } from 'src/app/model/user/user.model';
import { APIUrls } from 'src/app/model/config-model/api-url';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import * as _ from 'lodash';
import { filter } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  AllowAnonymousUrls: string[];
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private cookieService: CookieService) {
    this.AllowAnonymousUrls = [
      '/' + RoutesModel.Login,
      '/login/' + RoutesModel.ForgotPassword,
      '/login/' + RoutesModel.ResetPassword,
    ];
  }

  getCurrentUserFromCookie() {
    const currentUser = this.cookieService.get('currentUser');
    if (currentUser) {
      return JSON.parse(currentUser);
    }
    return null;
  }

  currentUser(): Observable<CurrentUser> {
    return this.httpClient.get<CurrentUser>(
      APIUrls.AuthUrls.GetCurrentUser
    );
  }
}
