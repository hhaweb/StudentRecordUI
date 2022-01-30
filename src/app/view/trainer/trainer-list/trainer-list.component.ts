import { HttpResponseData } from '../../../model/config-model/response.data';
import { ConfirmationService } from 'primeng/api';
import { SearchModel } from '../../../model/common/common.model';
import { forkJoin } from 'rxjs';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { Router } from '@angular/router';
import { CourseService } from '../../../service/controller-service/course.service';
import { Trainer } from '../../../model/student/trainer.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.scss']
})
export class TrainerListComponent implements OnInit {
  @ViewChild('dt', { static: true }) dataTable: Table;
  @Input()
  isShowAll: boolean = true;
  trainerList: Trainer[];
  tableLoading: boolean;
  totalRecord: number;
  searchKeyWord: string;
  isEditable: boolean;
  currentSearch: SearchModel;
  constructor(
    private courseService: CourseService,
    private router: Router,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.trainerList = [];
    if(this.isShowAll) {
      this.DefaultSearch();
    }
  }

  DefaultSearch() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 100;
    inputModel.sortName = 'trainerName';
    inputModel.sortType = 1;
    this.getTrainerList(inputModel);
  }

  searchFromStudent(key: string) {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'trainerName';
    inputModel.sortType = 1;
    inputModel.searchKeyword = key ? key.trim() : null;
    this.getTrainerList(inputModel);
  }

  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'trainerName';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getTrainerList(inputModel);
  }

  getTrainerList(inputModel: SearchModel) {
    this.currentSearch = inputModel;
    this.tableLoading = true;
    this.trainerList = []
    this.courseService.getTrainerList(inputModel).subscribe(
      (response: Trainer[]) => {
        if (response && response.length > 0) {
          this.trainerList = response;
          this.totalRecord = response[0].totalRecords;
          console.log('trainerList', this.trainerList);
        }
      }, (error: any) => {
        this.tableLoading = false;
        this.utilityService.subscribeError(error, 'Unable to load trainer list');
      },
      () => {
        this.tableLoading = false;
      }
    );
  }

  delete(trainer: Trainer) {
    this.confirmationService.confirm({
      key: 'globalConfirm',
      message:
        'Are you sure that you want to delete (' +trainer.trainerName+')?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.courseService.deleteTrainerById(trainer.id.toString()).subscribe(
          (response: HttpResponseData) => {
            if(response.status) {
              this.utilityService.showSuccess('Success','Delete Successfully');
              this.showAll();
            } else {
              this.utilityService.showError('Error', response.message)
            }
          }, (error: any) => {
            this.utilityService.subscribeError(error, 'Unable to delete')

          }, () => {
            this.utilityService.hideLoading();
          }
        );
      },
    });
  }

  create() {
    void this.router.navigate([`${RoutesModel.TrainerDetail}`]);
  }

  edit(id: number) {
    void this.router.navigate([`${RoutesModel.TrainerDetail}/${id}/edit`]);
  }

  search() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'trainerName';
    inputModel.sortType = 1;
    inputModel.searchKeyword = this.searchKeyWord ? this.searchKeyWord.trim() : null;
    this.getTrainerList(inputModel);
  }

  view(id: number) {
    void this.router.navigate([`${RoutesModel.TrainerDetail}/${id}/view`]);
  }
  

  showAll() {
    this.dataTable.clear();
    this.searchKeyWord = null;
    // this.DefaultSearch();
  }

  export() {
    this.utilityService.showLoading('Exporting');
    if(this.searchKeyWord) {
      this.currentSearch.searchKeyword = this.searchKeyWord.trim();
    }
    this.courseService.exportTrainerList(this.currentSearch).subscribe(
      (res: any) => {
        this.utilityService.hideLoading();
        if(!res.headers.get('content-disposition')) {
          this.utilityService.subscribeError(
            'Error',
            'File not found'
          );  
        }
        this.utilityService.fileSaveAs(res);
      },
      (error: any) => {
        this.utilityService.subscribeError(
          error,
          'Unable to download attachment'
        );
        setTimeout(() => this.utilityService.hideLoading(),1000);
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }
}
