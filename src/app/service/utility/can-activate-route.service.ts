import { LoginUser } from './../../model/user/user.model';
import { RoutesModel } from './../../model/config-model/route-model';
import { RouteModel } from './../../model/common/common.model';
import { UtilityService } from './utility.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AuthorizationService } from './authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';

@Injectable()
export class CanActivateRoute implements CanActivate {
  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // if (!this.authenticationService.isAuthorized()) {
    //   if (route.params) {
    //     const key = Object.keys(route.params);
    //     let newParamsRoute = route.data.newRoute;
    //     key.map((x) => {
    //       newParamsRoute = newParamsRoute.replace(':' + x, route.params[x]);
    //     });
    //     this.redirectToLogin(newParamsRoute);
    //   } else {
    //     this.redirectToLogin(route.data.newRoute);
    //   }

    //   return false;
    // }

    let routePermissions = [];
    const routePermissionsString = this.cookieService.get('routePermissions');
    if (routePermissionsString) {
      routePermissions = JSON.parse(routePermissionsString);
    } else {
      return true;
    }

    const routePermission = routePermissions.find(
      (x) => x === route.data.newRoute
    );

    if (!routePermission) {
      this.utilityService.showError(
        'Unauthorized Access',
        'You are not authorized to view the page'
      );

      const currentUser = JSON.parse(this.cookieService.get('currentUser'));
      let returnUrl = RoutesModel.Home;
      if (currentUser) {
        const roleName = currentUser.loginUser.role;
        if (roleName === AppConfigData.SuperAdminRole) {
          returnUrl = RoutesModel.Upload;
        } else if (roleName === AppConfigData.AdminRole) {
          returnUrl = RoutesModel.StudentList;
        } else {
          const studentId = currentUser.loginUser.studentId;
          returnUrl = 'student/student-details/' + studentId + '/view'
        }
      }
      void this.router.navigate([returnUrl]);
      return false;
    }
    return true;
  }

  // redirectToLogin(newRoute) {
  //   if (!this.authorizationService.isAllowAnonymous()) {
  //     // Generate returnUrl Parameters
  //     void this.router.navigate([PSTRoutes.Login], {
  //       queryParams: {
  //         return: newRoute,
  //       },
  //     });
  //   }
  // }
}
