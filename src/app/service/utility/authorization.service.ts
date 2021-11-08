import { AuthUrls } from '../../model/config-model/auth-url';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { CurrentUser, TokenResponse } from 'src/app/model/user/user.model';
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

     currentUserProfile(): CurrentUser {
      const userData = this.getCurrentUserFromCookie();
      return userData;
    }
  
    userHasRole(role: string): boolean {
      const userData = this.getCurrentUserFromCookie();
      if (!userData) {
        return false;
      }
      const roles: string[] = userData.userRoles.split(',');
      return roles.some((x) => x === role);
    }
  
    userAllowResource(resourceCode: string | string[]) {
      const userData = this.getCurrentUserFromCookie();
      if (!userData) {
        return false;
      }
  
      const permissions = filter(userData.Permissions, (p: any) => {
        return _.includes(resourceCode, p.ResourceCode);
      });
      return permissions.length > 0;
    }
  
    getCurrentUserFromCookie() {
      const currentUser = this.cookieService.get('currentUser');
      if (currentUser) {
        return JSON.parse(currentUser);
      }
      return null;
    }
  
    public isAllowAnonymous() {
      let route = this.router.url;
      if (this.router.url.indexOf('?') > -1) {
        route = this.router.url.substr(0, this.router.url.indexOf('?'));
      }
      if (this.AllowAnonymousUrls.indexOf(route) > -1) {
        return true;
      }
      return false;
    }

}
