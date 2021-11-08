import { AuthUrls } from './../../model/config-model/auth-url';
import { APIUrls } from './../../model/config-model/api-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CurrentUser, TokenResponse } from 'src/app/model/user/user.model';

import { Observable, Subject } from 'rxjs';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  public UserLoggedIn = new Subject<boolean>();

  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient,) {

    this.UserLoggedIn.next(false);
  }

  loginToWebApi(email: string, password: string): Observable<TokenResponse> {
    const userData = {
      email:  email,
      password: encodeURIComponent(password)
    }
    return this.httpClient.post<TokenResponse>(APIUrls.AuthUrls.Login, userData);
  }

  
  logout() {
    this.userLogout().subscribe(
      (response: HttpResponseData) => {
        if (response.status !== 'Successful') {
          console.log('logout unsuccessful');
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
    this.UserLoggedIn.next(false);
    this.cookieService.delete('currentUser');
    this.cookieService.delete('routePermissions');
    this.cookieService.delete('authorizationData');
    void this.router.navigate(['/' + RoutesModel.Login]);
  }

  userLogout() {
    return this.httpClient.post(APIUrls.AuthUrls.LogOut, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true,
    });
  }

  // forgotPassword(email: string): Observable<HttpResponseData> {
  //   let params: HttpParams = new HttpParams();
  //   params = params.append('email', email);
  //   return this.httpClient.get<HttpResponseData>(
  //     APIUrls.Account.ForgotPassword,
  //     { params }
  //   );
  // }

  // resetPassword(
  //   userId: string,
  //   password: string,
  //   code: string
  // ): Observable<HttpResponseData> {
  //   const model = {
  //     UserId: userId,
  //     Password: encodeURIComponent(password),
  //     Code: code,
  //   };
  //   const bodyString = JSON.stringify(model);
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.httpClient.post<HttpResponseData>(
  //     APIUrls.Account.ResetPassword,
  //     bodyString,
  //     { headers }
  //   );
  // }

  // changePassword(
  //   userId: string,
  //   currentPassword: string,
  //   newPassword: string
  // ): Observable<HttpResponseData> {
  //   const model = {
  //     UserId: userId,
  //     CurrentPassword: currentPassword,
  //     NewPassword: newPassword,
  //   };
  //   const bodyString = JSON.stringify(model);
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.httpClient.post<HttpResponseData>(
  //     APIUrls.Account.ChangePassword,
  //     bodyString,
  //     { headers }
  //   );
  // }

  getUserInfo(): Observable<CurrentUser> {
    return this.httpClient.get<CurrentUser>(APIUrls.AuthUrls.GetCurrentUser);
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.UserLoggedIn.asObservable();
  }
  // getValidTwoFactorProviders(): Observable<HttpResponseData> {
  //     return this.httpClient.get<HttpResponseData>(APIUrls.Identity.GetValidTwoFactorProviders);
  // }

  // twoFactorAuthRequired(): Observable<HttpResponseData> {
  //     return this.httpClient.get<HttpResponseData>(APIUrls.Identity.TwoFactorAuthRequired);
  // }

  // sendCode(selectedProvider: string): Observable<HttpResponseData> {
  //     return this.httpClient.get<HttpResponseData>(APIUrls.Identity.SendCode + '?selectedProvider=' + selectedProvider);
  // }

  // verifyCode(verificationCode: string, selectedProvider: string): Observable<HttpResponseData> {
  //     const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //     return this.httpClient.get<HttpResponseData>(APIUrls.Identity.VerifyCode + '?code=' +
  //         verificationCode + '&selectedProvider=' + selectedProvider);
  // }

  isAuthorized(): boolean {
    const authorizationData = this.cookieService.get('authorizationData');
    const twoFactorRequired = this.cookieService.get('twoFactorRequired');

    if (
      authorizationData &&
      (!twoFactorRequired || twoFactorRequired === 'False')
    ) {
      return true;
    }
    return false;
  }

  getPasswordChangeRemainingDays(passwordAge: number): number {
    return 60 - passwordAge;
  }
}
