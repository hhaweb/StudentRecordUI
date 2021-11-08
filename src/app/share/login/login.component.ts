import { AuthorizationService } from './../../service/utility/authorization.service';
import { UtilityService } from './../../service/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { TokenResponse } from 'src/app/model/user/user.model';
import { AppComponent } from 'src/app/app.component';
import { CookieService } from 'ngx-cookie-service';
import { ConfigDataLoadedEvent } from '../event/config-data-loaded.event';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { ConfigData } from 'src/app/model/system/system.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password: string;
  email: string;
  webApiToken: TokenResponse;
  returnUrl: string;
  constructor(
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private authenticationService: AuthenticationService,
    public app: AppComponent,
    private cookieService: CookieService,
    private configDataLoadedEvent: ConfigDataLoadedEvent,
    private router: Router) {  
  this.email = '';
  this.password = ''; 
  }

  ngOnInit( ): void {}

  login() {
    if (!this.email || !this.password) {
      this.utilityService.showError(
        'Invalid Input',
        'Please enter user name and password.'
      );
      return;
    }
    const that = this;
    this.authenticationService.loginToWebApi(this.email, this.password).subscribe(
      (response: TokenResponse) => {
        that.utilityService.hideLoading();
        that.webApiToken = response;
        this.app.configData = new ConfigData();
        this.app.configData.menuList = response.menuList;
        this.configDataLoadedEvent.fire(this.app.configData);
        const today = new Date();
        const hours = today.getHours() + 1;
        that.authenticationService.UserLoggedIn.next(true);
        
        const expirationDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          today.getMinutes(),
          0,
          0
        );
        that.cookieService.set(
          'authorizationData',
          JSON.stringify({
            token: that.webApiToken.token,
            userName: that.webApiToken.userName, 
            email: that.webApiToken.email 

          }),
          expirationDate,
          '/'
        );

        const isSuperAdmin = response.roles.indexOf('ROLE_SUPER_ADMIN');
        const isAdmin = response.roles.indexOf('ROLE_ADMIN');
        const isStudent = response.roles.indexOf('ROLE_STUDENT');

        

        if(isSuperAdmin != -1) {
          this.returnUrl = 'upload/data-upload'
        } else if(isAdmin != -1) {
          this.returnUrl = 'student/student-list'
        } else {
          this.returnUrl = 'student/profile'
        }

        void this.router.navigateByUrl(this.returnUrl);


      },
      (err) => {
        // console.log(err);
        let errorMessage = err.error
          ? err.error.error_description
          : 'Login Failed';
        that.utilityService.hideLoading();
        if (err.error && err.error.error === 'account_locked') {
          // popup dialog
          errorMessage = err.error.error_description;
          that.utilityService.showErrorModal(
            'Account Locked',
            errorMessage
          );
        } else if (
          err.error &&
          err.error.error === 'external_access_not_allowed'
        ) {
          errorMessage = 'External Acccess Not Allowed';
          that.utilityService.showErrorModal(
            'Account Locked',
            errorMessage
          );
        } else {
          if (!errorMessage) {
            errorMessage = 'Unknow error. Please contact administrator';
          }
          that.utilityService.showError('Failed', errorMessage);
        }
      }
    );

  }

}
