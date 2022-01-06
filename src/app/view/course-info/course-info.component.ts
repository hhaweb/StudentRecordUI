import { forkJoin } from 'rxjs';

import { CourseService } from './../../service/controller-service/course.service';
import { Component, Input, OnInit } from '@angular/core';
import { Student } from 'src/app/model/student/student.model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { Course } from 'src/app/model/student/course.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {
  courseId: string;
  course: Course;

  studentList: Student[];
  isEditable: boolean;
  tableLoading: boolean;
  totalStudents: number;


  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private router: Router,
    private courseService: CourseService,
    private authorizationService: AuthorizationService) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
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

  getCourseDetail(courseID: string) {
    if (courseID) {
      this.utilityService.showLoading("Loading");
      this.courseService.getCourseById(courseID).subscribe(
        (res: Course) => {
          if (res) {
            this.course = res;
            console.log('course detail ', res);
            this.getStudentByCourseId(res.courseId);
          //  this.studentList = res.studentList ? res.studentList : [];
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

  
  save() {
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
    void this.router.navigate([RoutesModel.StudentList]);
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
