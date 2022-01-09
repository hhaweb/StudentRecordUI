import { CommonService } from './../../service/controller-service/common.service';
import { repeat } from 'lodash';
import { forkJoin } from 'rxjs';

import { CourseService } from './../../service/controller-service/course.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Student } from 'src/app/model/student/student.model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { Course } from 'src/app/model/student/course.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { SelectItem } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {
  courseId: string;
  course: Course;


  studentList: Student[];
  isEditable: boolean;
  tableLoading: boolean;
  totalStudents: number;
  selectedStartDate: Date;
  selectedEndDate: Date;

  availableTrainerList: SelectItem[] =[];
  availableCourseLevel: SelectItem[] =[];
  availableCourseStatus: SelectItem[] = [];
  availableCoursesector: SelectItem[] = [];


  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private router: Router,
    private courseService: CourseService,
    private authorizationService: AuthorizationService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    const loadTrainerItems = this.courseService.getTrainerItems();
    const loadCourseLevel = this.commonService.getDropDownItem("Course Level");
    const loadCourseStatus = this.commonService.getDropDownItem("Course Status");
    const loadCourseSector = this.commonService.getDropDownItem("Course sector");
    this.studentList = [];
    forkJoin([loadCurrentCuser,loadTrainerItems, loadCourseLevel, loadCourseStatus, loadCourseSector]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        this.availableTrainerList = data[1];
        this.availableTrainerList.unshift({label: '-', value: null, disabled: false})
        this.availableCourseLevel = data[2];
        this.availableCourseLevel.unshift({label: '-', value: null, disabled: false})
        this.availableCourseStatus = data[3];
        this.availableCourseStatus.unshift({label: '-', value: null, disabled: false})
        this.availableCoursesector = data[4];
        this.availableCoursesector.unshift({label: '-', value: null, disabled: false})
      });
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.courseId = params.id;
        this.getCourseDetail(params.id);
      } else {
        this.course = new Course();
      }      
    });
  }
  
  ngOnDestroy(): void {
    this.course = new Course();
    this.courseId = null;
    this.studentList = [];
    this.tableLoading = false;
    this.availableTrainerList = []
  }

  getCourseDetail(courseID: string) {
    if (courseID) {
      this.utilityService.showLoading("Loading");
      this.courseService.getCourseById(courseID).subscribe(
        (res: Course) => {
          if (res) {
            this.course = res;
            if(res.startDate) {
              this.selectedStartDate = moment(res.startDate, 'DD/MM/yyyy').toDate();
            }

            if(res.endDate) {
              this.selectedEndDate = moment(res.endDate, 'DD/MM/yyyy').toDate();
            }

            this.getStudentByCourseId(res.courseId);
          }
        }, (error: any) => {
          this.utilityService.subscribeError(
            error,
            'Unable to load course detail'
          );
        },
        () => {
          this.utilityService.hideLoading();
        }
      );
    }
  }

  getStudentByCourseId(courseId: string) {
    this.studentList = [];
    this.tableLoading = true;
    this.studentService.getStudentsByCourseId(courseId).subscribe(
      (response: Student[]) => {
        if(response?.length > 0) {
          console.log('student list ',response);
          this.studentList = response;
          this.totalStudents = response.length;
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load student')
      }, () => {
        this.tableLoading = false;
      }
    );
  }

  setTrainerId(){
    this.course.trainerId= this.course.trainerName;

  }

  
  save() {
    if(this.selectedStartDate) {
      this.course.startDate = moment(this.selectedStartDate).format('DD/MM/yyyy');
    }

    if(this.selectedEndDate) {
      this.course.endDate = moment(this.selectedEndDate).format('DD/MM/yyyy');
    }

    this.courseService.saveCourse(this.course).subscribe(
      (response: HttpResponseData) => {
        if(response.status) {
          this.utilityService.showSuccess('Success', 'Save Successfully');
          this.getCourseDetail(response.id);
        } else {
          this.utilityService.subscribeError(
            'Unable to save course',
            response.message
          );
        }
      }, (error: any) => {
        this.utilityService.subscribeError(
          error,
          'Unable to save course'
        );
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

  editStudent(id: number) {
    void this.router.navigate([`${RoutesModel.StudentDetails}/${id}/edit`]);
  }

  viewStudent(id: number) {
    void this.router.navigate([`${RoutesModel.StudentDetails}/${id}/view`]);
  }

  back() {
    void this.router.navigate([RoutesModel.CourseList]);
  }

  export() {
    this.utilityService.showLoading('Exporting');
    if(this.course) {
      this.courseService.exportCourseDetail(this.course.id).subscribe(
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
}
