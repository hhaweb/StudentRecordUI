import { RoutesModel } from './../../model/config-model/route-model';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from 'src/app/model/user/user.model';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { repeat } from 'lodash';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: CurrentUser = new CurrentUser();
  userId: string;
  isEditable: boolean;
  isNew: boolean;
  availableRoles: SelectItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenService: AuthenticationService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.isEditable = true;
    const getRoles = this.authenService.getRoles();
    forkJoin([getRoles]).subscribe(
      (data: any) => {
        this.availableRoles = data[0];
      });
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.userId = params.id;
        this.getUserById(params.id);
      }
    });
  }

  getUserById(id: string) {
    this.utilityService.showLoading('Loaing');
    this.authenService.getUserById(id).subscribe(
      (response: CurrentUser) => {
        if (response) {
          this.user = response;
          if(response.role && response.role.length > 0) {
            const role = this.availableRoles.filter(x => x.label === response.role[0]);
            this.user.roleId = role?.length > 0 ? role[0].value : null;
          }
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
    this.user = new CurrentUser();
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
    if(!this.user.roleId) {
      this.utilityService.showWarning('Warning', 'Please add role')
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
