import { TrainerListComponent } from './../trainer-list/trainer-list.component';
import { forkJoin } from 'rxjs';
import { Student } from './../../model/student/student.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router } from '@angular/router';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { RouteModel, SearchModel } from 'src/app/model/common/common.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { CourseListComponent } from '../course-list/course-list.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  @ViewChild('courseList', { static: true })
  courseList: CourseListComponent;

  @ViewChild('trainerList', { static: true })
  trainerList: TrainerListComponent;

  students: Student[];
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
    private authorizationService: AuthorizationService) { }

  ngOnInit(): void {
    this.tableLoading = false;
    this.students = [];
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
    inputModel.sortName = 'name';
    inputModel.sortType = 1;
    this.getStudentList(inputModel);
  }


  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'name';
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
        console.log(response)
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

  getStudentById(studentId: string) {
   // this.utilService.showLoading('Searching');
    this.students = [];
    this.studentService.getStudentById(studentId).subscribe(
      (res: Student) => {
        if(res) {
          this.totalStudents = 1;
          this.students.push(res);
          console.log('student ', this.students);
          this.utilityService.hideLoading();
        } else {
          this.utilityService.showWarning('Warning','No record found.')
        }
      },(error: any) => {
      this.utilityService.hideLoading()
        this.utilityService.subscribeError(
        error,
        'Unable to search student'
      );
    },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }


  search(searchType: string) {
    
    if(searchType === 'student' && this.studentSearchKeyWord) {
      this.searchInfo = 'student';
      const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'name';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.studentSearchKeyWord;
      this.getStudentList(inputModel);

    } else if(searchType === 'course' && this.courseSearchKeyWord) {
      this.searchInfo = 'course';
      this.courseList.searchFromStudentList(this.courseSearchKeyWord);

    } else if(searchType === 'trainer'){
      this.searchInfo = 'trainer';
      this.trainerList.searchFromStudent(this.trainerSearchKeyWord);
    }

  }
  showAll() {
    this.studentSearchKeyWord = null;
    this.courseSearchKeyWord = null;
    this.trainerSearchKeyWord = null;
    this.searchInfo = 'student'
    this.DefaultSearch();
  }
  export() {
    this.utilityService.showLoading('Exporting');
    if(this.studentSearchKeyWord) {
      this.currentSearch.searchKeyword = this.studentSearchKeyWord;
    }
    this.studentService.exportStudentList(this.currentSearch).subscribe(
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
