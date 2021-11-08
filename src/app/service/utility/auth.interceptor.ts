import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { RoutesModel } from 'src/app/model/config-model/route-model';

@Injectable()
export class HttpsAuthRequestInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private utilityService: UtilityService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set(
        'Access-Control-Allow-Origin',
        environment.UI_URL
      ),
    });
    req = req.clone({
      headers: req.headers.set('Access-Control-Allow-Credentials', 'true'),
    });
    req = req.clone({
      headers: req.headers.set(
        'Access-Control-Allow-Headers',
        'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With'
      ),
    });
    req = req.clone({
      headers: req.headers.set(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, OPTIONS'
      ),
    });
    // extend cookie expiration
    const authorizationData = this.cookieService.get('authorizationData');
    if (authorizationData) {
      const authData = JSON.parse(this.cookieService.get('authorizationData'));

      if (authData) {
        req = req.clone({
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          headers: req.headers.set('Authorization', 'Bearer ' + authData.token),
        });
      }
      this.cookieService.delete('authorizationData');
      const today = new Date();
      const hours = today.getHours() + 1;
      const expirationDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        today.getMinutes(),
        0,
        0
      );
      this.cookieService.set(
        'authorizationData',
        JSON.stringify(authData),
        expirationDate,
        '/'
      );
      // this._cookieService.put('twoFactorRequired', 'False', cookieOptions);
    }
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.utilityService.hideLoading();
              if (
                err.error.Code === 101 &&
                (this.router.url === '/verify-code' ||
                  this.router.url !== '/login')
              ) {
                return;
              } else if (
                err.error.Code === 101 &&
                this.router.url !== '/verify-code' &&
                this.router.url !== '/login'
              ) {
                // this requires two-factor auth
                // this.router.navigate([PSTRoutes.SendCode]);
              } else {
                void this.router.navigate([RoutesModel.Login]);
                // redirect to the login route
                // or show a modal
              }
            }
            // forbidden error
            if (err.status === 403) {
              this.utilityService.hideLoading();
              void this.router.navigate(['/']); // return to home page
              this.utilityService.showError(
                'Unauthorize',
                'You are not authorised to do this action'
              );
            }
          }
        }
      )
    );
  }
}
