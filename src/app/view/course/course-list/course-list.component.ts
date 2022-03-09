import { Table } from 'primeng/table';
import { RoutesModel } from '../../../model/config-model/route-model';
import { SearchModel } from '../../../model/common/common.model';
import { forkJoin } from 'rxjs';
import { UtilityService } from '../../../service/utility/utility.service';
import { Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Course } from 'src/app/model/student/course.model';
import { CourseService } from 'src/app/service/controller-service/course.service';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { ConfirmationService } from 'primeng/api';
import { HttpResponseData } from 'src/app/model/config-model/response.data';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  @ViewChild('dt', { static: true }) dataTable: Table;
  @Input()
  isShowAll: boolean = true;

  courseList: Course[];
  selectedCourseList: Course[];
  tableLoading: boolean;
  totalRecord: number;
  searchKeyWord: string;
  isEditable: boolean;
  currentSearch: SearchModel;
  deleteAll: boolean;
  constructor(
    private courseService: CourseService,
    private router: Router,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.courseList = [];
    this.selectedCourseList = [];
    if(this.isShowAll) {
      this.DefaultSearch();
    }
  }

  DefaultSearch() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'courseName';
    inputModel.sortType = 1;
    this.getCourseList(inputModel);
  }

  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'courseName';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getCourseList(inputModel);
  }

  getCourseList(inputModel: SearchModel) {
    this.currentSearch = inputModel;
    this.tableLoading = true;
    this.courseList = []
    this.courseService.getCourseList(inputModel).subscribe(
      (response: Course[]) => {
        if (response && response.length > 0) {
          this.courseList = response;
          this.totalRecord = response[0].totalRecords;
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


  view(id: number) {
    void this.router.navigate([`${RoutesModel.CourseInfo}/${id}/view`]);

  }

  create() {
    void this.router.navigate([`${RoutesModel.CourseInfo}`]);
  }

  edit(id: number) {
    void this.router.navigate([`${RoutesModel.CourseInfo}/${id}/edit`]);
  }

  search() {
    const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'courseName';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.searchKeyWord ? this.searchKeyWord.trim() : null;
      this.getCourseList(inputModel);
  }

  searchFromStudentList(key: string) {
    this
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'courseName';
    inputModel.sortType = 1;
    inputModel.searchKeyword = key ? key.trim() : null;
    this.getCourseList(inputModel);
  }

  showAll() {
    this.dataTable.clear();
    this.searchKeyWord = null;
    this.selectedCourseList = [];
    this.deleteAll = false;
    //this.DefaultSearch();
  }

  export() {
    this.utilityService.showLoading('Exporting');
    if(this.searchKeyWord) {
      this.currentSearch.searchKeyword = this.searchKeyWord.trim();
    }
    this.courseService.exportCourseList(this.currentSearch).subscribe(
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

  delete(id: number) {
    this.confirmationService.confirm({
      key: 'globalConfirm',
      message:
        'Are you sure that you want to delete ',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.utilityService.showLoading('Deleting')
        this.courseService.deleteCourseById(id.toString()).subscribe(
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

  checkAll() {
    this.selectedCourseList = this.deleteAll ? this.courseList : [];
  }

  deleteCourses() {
    if(this.selectedCourseList.length > 0) {
      this.confirmationService.confirm({
        key: 'globalConfirm',
        message:
          'Are you sure that you want to delete (' + this.selectedCourseList.length + ') courses ?',
        header: 'Confirmation',
        icon: 'pi pi-question-circle',
        accept: () => {
          this.utilityService.showLoading('Deleting')
          this.courseService.deleteCourses(this.selectedCourseList).subscribe(
            (response: HttpResponseData) => {
              if (response.status) {
                this.utilityService.showSuccess('Success', 'Delete Successfully');
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
  }
}
