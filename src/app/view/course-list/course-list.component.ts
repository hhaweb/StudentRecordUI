import { RoutesModel } from './../../model/config-model/route-model';
import { SearchModel } from './../../model/common/common.model';
import { forkJoin } from 'rxjs';
import { UtilityService } from './../../service/utility/utility.service';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/model/student/course.model';
import { CourseService } from 'src/app/service/controller-service/course.service';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  @Input()
  isShowAll: boolean = true;

  courseList: Course[];
  tableLoading: boolean;
  totalRecord: number;
  searchKeyWord: string;
  isEditable: boolean;
  constructor(
    private courseService: CourseService,
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
    this.courseList = [];
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

  delete(trainer: Course) {

  }

  create() {
    void this.router.navigate([`${RoutesModel.CourseInfo}`]);
  }

  edit(id: number) {
    void this.router.navigate([`${RoutesModel.CourseInfo}/${id}`]);
  }

  search() {
    if (this.searchKeyWord) {
      const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'courseName';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.searchKeyWord.trim();
      this.getCourseList(inputModel);
    }
  }

  searchFromStudentList(key: string) {
    this
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'courseName';
    inputModel.sortType = 1;
    inputModel.searchKeyword = key.trim();
    this.getCourseList(inputModel);
  }

  showAll() {
    this.searchKeyWord = null;
    this.DefaultSearch();
  }
}
