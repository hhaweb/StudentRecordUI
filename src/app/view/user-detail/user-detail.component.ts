import { RoutesModel } from './../../model/config-model/route-model';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser, User } from 'src/app/model/user/user.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { repeat } from 'lodash';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User;
  userId: string;
  isEditable: boolean;
  isNew: boolean;
  selectedRoleId: string;
  availableRoles: SelectItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    const getRoles = this.authenService.getRoles();
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([getRoles,loadCurrentCuser]).subscribe(
      (data: any) => {
        this.availableRoles = data[0];
        console.log('this.availableRoles = ', this.availableRoles);
        const currentUser = data[1];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        console.log('this.isEditable =', this.isEditable)
      });
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.userId = params.id;
        this.getUserById(params.id);
      } else {
        console.log('user =',this.user)
        this.user = new User("","");
        console.log('user =',this.user)
      }
    });
  }

  getUserById(id: string) {
    this.utilityService.showLoading('Loaing');
    this.authenService.getUserById(id).subscribe(
      (response: User) => {
        if (response) {
          this.user = response;
          this.selectedRoleId =  response.roleId ? response.roleId.toString() :  null;
         
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load user')
      }, () => {
        this.utilityService.hideLoading();
      }
    );
  }

  initializeForm() {
    this.isEditable = true;
    this.user = new User("","");
  }

  back() {
    void this.router.navigate([`${RoutesModel.UserList}`]);

  }

  save() {
    if(!this.user.userName) {
      this.utilityService.showWarning('Warning','Please add user name');
      return;
    }
    if(!this.user.id && !this.user.password) {
      this.utilityService.showWarning('Warning','Please add password');
    }
    if(!this.selectedRoleId) {
      this.utilityService.showWarning('Warning', 'Please add role')
    } else {
      this.user.roleId = Number(this.selectedRoleId);
    }

    this.utilityService.showLoading('Saving');
    this.authenService.saveUser(this.user).subscribe(
      (response: HttpResponseData) => {
        if(response.status) {
         this.utilityService.showSuccess('Success', "Save Successfully");
         this.getUserById(response.id);
        } else {

        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to save');
      }, () => {
        this.utilityService.hideLoading();
      }
    );
  }
}
