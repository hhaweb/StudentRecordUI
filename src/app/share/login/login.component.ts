import { AuthorizationService } from './../../service/utility/authorization.service';
import { UtilityService } from './../../service/utility/utility.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoginUser, TokenResponse } from 'src/app/model/user/user.model';
import { AppComponent } from 'src/app/app.component';
import { CookieService } from 'ngx-cookie-service';
import { ConfigDataLoadedEvent } from '../event/config-data-loaded.event';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { ConfigData } from 'src/app/model/system/system.model';
import { Router } from '@angular/router';
import { FullScreenService } from '../event/full-screen.service';
import { forkJoin } from 'rxjs';
import { AppConfigData } from 'src/app/model/config-model/config-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  password: string;
  userName: string;
  webApiToken: TokenResponse;
  returnUrl: string;
  constructor(
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private authenticationService: AuthenticationService,
    public app: AppComponent,
    private cookieService: CookieService,
    private configDataLoadedEvent: ConfigDataLoadedEvent,
    private fullScreenService: FullScreenService,
    private router: Router) {
    this.userName = '';
    this.password = '';
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.fullScreenService.fire();
    console.log('enter');
  }

  login() {
    if (!this.userName || !this.password) {
      this.utilityService.showError(
        'Invalid Input',
        'Please enter user name and password.'
      );
      return;
    }
    const that = this;
    this.utilityService.showLoading('Loggin in ...')
    this.authenticationService.loginToWebApi(this.userName, this.password).subscribe(
      (response: TokenResponse) => {
        if (!response.status) {
          this.utilityService.showError('Error', 'Invalid username and password');
          console.log('Invalid user name and password')
          return;
        }
        console.log('login', response);
        that.utilityService.hideLoading();
        that.webApiToken = response;
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
            token: that.webApiToken.token
          }),
          expirationDate,
          '/'
        );

        const loadSystemConfig = this.authenticationService.getSystemConfig();
        forkJoin([loadSystemConfig]).subscribe(
          (data: any) => {
            console.log('get config data ', data[0]);
            this.app.configData = new ConfigData();
            this.app.configData = data[0];
            if (this.app.configData.routeList) {
              this.cookieService.set('routePermissions', JSON.stringify(this.app.configData.routeList), expirationDate,
                '/');
            }
            const loginUser = new LoginUser();
            loginUser.userId = this.app.configData.userId;
            loginUser.studentId = this.app.configData.studentId ? this.app.configData.studentId : 0;
            loginUser.userName = this.app.configData.userName;
            loginUser.role = this.app.configData.role;
            that.cookieService.set(
              'currentUser',
              JSON.stringify({loginUser}),
              expirationDate,
              '/'
            );

            if (this.app.configData.role === AppConfigData.SuperAdminRole) {
              this.returnUrl = 'upload/data-upload'
            } else if (this.app.configData.role === AppConfigData.AdminRole) {
              this.returnUrl = 'student/student-list'
            } else {
              this.returnUrl = 'student/student-details/' + this.app.configData.studentId + '/view'
            }
            void this.router.navigate([this.returnUrl]);
            this.configDataLoadedEvent.fire(data[0]);
          }
          ,
          (error: any) => {
            this.utilityService.showErrorModal('Error', error);
          }
        );
      },
      (err) => {
        console.log('error:::::', err.message);
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
