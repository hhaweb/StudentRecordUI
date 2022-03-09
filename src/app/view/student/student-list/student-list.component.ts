import { Table } from 'primeng/table';
import { HttpResponseData } from '../../../model/config-model/response.data';
import { ConfirmationService } from 'primeng/api';
import { TrainerListComponent } from '../../trainer/trainer-list/trainer-list.component';
import { forkJoin } from 'rxjs';
import { Student } from '../../../model/student/student.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router } from '@angular/router';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { RouteModel, SearchModel } from 'src/app/model/common/common.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { CourseListComponent } from '../../course/course-list/course-list.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  @ViewChild('dt', { static: true }) dataTable: Table;
  @ViewChild('courseList', { static: true })
  courseList: CourseListComponent;

  @ViewChild('trainerList', { static: true })
  trainerList: TrainerListComponent;

  students: Student[];
  selectedStudents: Student[];
  deleteAll: boolean;
  currentSearch: SearchModel;
  totalStudents = 0;
  studentSearchKeyWord: string;
  courseSearchKeyWord: string;
  trainerSearchKeyWord: string;

  selectedCourseID: string;
  searchInfo: string = 'student';
  tableLoading: boolean;
  isEditable: boolean;

  constructor(private studentService: StudentService,
    private utilService: UtilityService,
    private router: Router,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.tableLoading = false;
    this.students = [];
    this.selectedStudents = [];
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.DefaultSearch();
  }

  DefaultSearch() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'inDate';
    inputModel.sortType = 1;
    this.getStudentList(inputModel);
  }


  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'inDate';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getStudentList(inputModel);
  }

  getStudentList(inputModel: SearchModel) {
    this.tableLoading = true;
    this.students = [];
    this.currentSearch = inputModel;
    this.studentService.getStudentList(inputModel).subscribe(
      (response: Student[]) => {
        if (response?.length > 0) {
          this.students = response;
          this.totalStudents = response[0].totalRecord;
        }

      },
      (error: any) => {
        this.tableLoading = false;
        this.utilService.subscribeError(error, 'Unable to load students')
      },
      () => {
        this.tableLoading = false;
      }
    )
  }

  viewStudent(id: number) {
    void this.router.navigate([`${RoutesModel.StudentDetails}/${id}/view`]);
  }

  editStudent(id: number) {
    const routeModel = new RouteModel();
    void this.router.navigate([`${RoutesModel.StudentDetails}/${id}/edit`]);
  }


  search(searchType: string) {

    if (searchType === 'student') {
      this.searchInfo = 'student';
      const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'inDate';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.studentSearchKeyWord ? this.studentSearchKeyWord.trim() : null;
      this.getStudentList(inputModel);

    } else if (searchType === 'course') {
      this.searchInfo = 'course';
      this.courseList.searchFromStudentList(this.courseSearchKeyWord);

    } else if (searchType === 'trainer') {
      this.searchInfo = 'trainer';
      this.trainerList.searchFromStudent(this.trainerSearchKeyWord);
    }

  }

  showAll() {
    this.studentSearchKeyWord = null;
    this.courseSearchKeyWord = null;
    this.trainerSearchKeyWord = null;
    this.selectedStudents = [];
    this.dataTable.clear();
    this.searchInfo = 'student'
    this.deleteAll = false;
    //this.DefaultSearch();
  }

  export() {
    this.utilityService.showLoading('Exporting');
    if (this.studentSearchKeyWord) {
      this.currentSearch.searchKeyword = this.studentSearchKeyWord.trim();
    }
    this.studentService.exportStudentList(this.currentSearch).subscribe(
      (res: any) => {
        this.utilityService.hideLoading();
        if (!res.headers.get('content-disposition')) {
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
        setTimeout(() => this.utilityService.hideLoading(), 1000);
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

  delete(student: Student) {
    this.confirmationService.confirm({
      key: 'globalConfirm',
      message:
        'Are you sure that you want to delete (' + student.name + ')?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.studentService.deleteStudentById(student.id.toString()).subscribe(
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

  create() {
    void this.router.navigate([`${RoutesModel.StudentProfile}`]);
  }

  checkAll() {
    this.selectedStudents = this.deleteAll ? this.students : [];
    //console.log(this.deleteAll);
  }

  deleteStudents() {
    if(this.selectedStudents.length > 0) {
      this.confirmationService.confirm({
        key: 'globalConfirm',
        message:
          'Are you sure that you want to delete (' + this.selectedStudents.length + ') students ?',
        header: 'Confirmation',
        icon: 'pi pi-question-circle',
        accept: () => {
          this.utilService.showLoading('Deleting');
          this.studentService.deleteStudents(this.selectedStudents).subscribe(
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
