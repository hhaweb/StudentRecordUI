import { AppConfigData } from './../../model/config-model/config-data';
import { forkJoin } from 'rxjs';
import { AuthorizationService } from './../../service/utility/authorization.service';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { CurrentUser } from 'src/app/model/user/user.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { SearchModel } from 'src/app/model/common/common.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isEditable: Boolean;
  userList: CurrentUser[];
  tableLoading: boolean;
  totalRecord: number;
  searchKeyWord: string;

  constructor(
    private userService: AuthenticationService,
    private router: Router,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.userList = [];
    this.DefaultSearch();
  }

  DefaultSearch() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'userName';
    inputModel.sortType = 1;
    this.getUserList(inputModel);
  }

  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'userName';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getUserList(inputModel);
  }

  getUserList(inputModel: SearchModel) {
    this.tableLoading = true;
    this.userList = []
    this.userService.getUserList(inputModel).subscribe(
      (response: CurrentUser[]) => {
        if (response && response.length > 0) {
          this.userList = response;
          this.totalRecord = response[0].totalRecord;
        } else {
          this.utilityService.subscribeError('Server Error', 'Unable to load user list');
        }
      }, (error: any) => {
        this.tableLoading = false;
        this.utilityService.subscribeError(error, 'Unable to load user list');
      },
      () => {
        this.tableLoading = false;
      }
    );
  }

  
  delete(trainer: CurrentUser) {

  }

  create() {
    void this.router.navigate([`${RoutesModel.UserDetail}`]);
  }

  edit(id: number) {

    void this.router.navigate([`${RoutesModel.UserDetail}/${id.toString()}`]);
  }

  search() {
    if (this.searchKeyWord) {
      const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'userName';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.searchKeyWord.trim();
      this.getUserList(inputModel);
    }
  }

  showAll() {
    this.searchKeyWord = null;
    this.totalRecord = 0;
    this.tableLoading = false;
    this.DefaultSearch();
  }

}
