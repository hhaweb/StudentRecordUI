import { StudentDialogComponent } from './../../student/student-dialog/student-dialog.component';
import { CommonService } from '../../../service/controller-service/common.service';
import { forkJoin } from 'rxjs';
import { CourseService } from '../../../service/controller-service/course.service';
import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Student } from 'src/app/model/student/student.model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { Course } from 'src/app/model/student/course.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { ConfirmationService, SelectItem } from 'primeng/api';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit, OnDestroy {
  @ViewChild('studentDialog', { static: true })
  studentDialog: StudentDialogComponent;
  courseId: string;
  course: Course;

  isNew: boolean;
  studentList: Student[];
  isEditable: boolean;
  tableLoading: boolean;
  totalStudents: number;
  selectedStartDate: Date;
  selectedEndDate: Date;

  availableTrainerList: SelectItem[] = [];
  availableCourseLevel: SelectItem[] = [];
  availableCourseStatus: SelectItem[] = [];
  availableCoursesector: SelectItem[] = [];
  isViewOnly: boolean;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private router: Router,
    private courseService: CourseService,
    private authorizationService: AuthorizationService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.courseId = params.id;
        this.isViewOnly = params.type == 'view' ? true : false;
        this.isNew = false;
        this.getCourseDetail(params.id);
      } else {
        this.isNew = true;
      }
    });
    this.totalStudents = 0;
    const loadCurrentCuser = this.authorizationService.currentUser();
    const loadTrainerItems = this.courseService.getTrainerItems();
    const loadCourseLevel = this.commonService.getDropDownItem("Course Level");
    const loadCourseStatus = this.commonService.getDropDownItem("Course Status");
    const loadCourseSector = this.commonService.getDropDownItem("Course sector");
    this.course = new Course();
    this.studentList = [];
    forkJoin([loadCurrentCuser, loadTrainerItems, loadCourseLevel, loadCourseStatus, loadCourseSector]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        if (this.isViewOnly) {
          this.isEditable = false;
        }
        this.availableTrainerList = data[1];
        this.availableTrainerList.unshift({ label: '-', value: null, disabled: false })
        this.availableCourseLevel = data[2];
        this.availableCourseLevel.unshift({ label: '-', value: null, disabled: false })
        this.availableCourseStatus = data[3];
        this.availableCourseStatus.unshift({ label: '-', value: null, disabled: false })
        this.availableCoursesector = data[4];
        this.availableCoursesector.unshift({ label: '-', value: null, disabled: false })
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
            if (res.startDate) {
              this.selectedStartDate = moment(res.startDate, 'DD/MM/yyyy').toDate();
            }

            if (res.endDate) {
              this.selectedEndDate = moment(res.endDate, 'DD/MM/yyyy').toDate();
            }

            this.getStudentByCourseId(res.id);
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

  getStudentByCourseId(id: number) {
    this.studentList = [];
    this.tableLoading = true;
    const courseId = id.toString(); // id from course table not course id
    this.studentService.getStudentsByCourseId(courseId).subscribe(
      (response: Student[]) => {
        if (response?.length > 0) {
         // console.log('student list ', response);
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

  setTrainerId() {
    this.course.trainerId = this.course.trainerName;

  }


  save() {
    if (!this.course.courseId || this.course.courseId.trim() == '') {
      this.utilityService.showWarning('warning', 'Please add course id');
      return;
    }

    if (!this.course.courseName || this.course.courseName.trim() == '') {
      this.utilityService.showWarning('warning', 'Please add course name');
      return;
    }

    if (this.selectedStartDate) {
      this.course.startDate = moment(this.selectedStartDate).format('DD/MM/yyyy');
    }

    if (this.selectedEndDate) {
      this.course.endDate = moment(this.selectedEndDate).format('DD/MM/yyyy');
    }
    this.course.courseId = this.course.courseId.trim();
    this.courseService.saveCourse(this.course).subscribe(
      (response: HttpResponseData) => {
        if (response.status) {
          this.utilityService.showSuccess('Success', 'Save Successfully');
          this.getCourseDetail(response.id);
          this.isNew = false;
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
    //console.log('export ==', this.course);
    if (this.course) {
      this.courseService.exportCourseDetail(this.course.id).subscribe(
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

  }

  openStudentDialog() {
    this.studentDialog.openDialog();
  }

  addStudentToCourse(studentList: Student[]) {
    const saveStudentList = studentList.reduce((a: Course[], c) => { 
      const index = this.studentList.findIndex(x => x.id == c.id);
      if(index === -1) {
        const course = new Course();
        c.gender === 'M' ? this.course.cohortSizeMale ++ : this.course.cohortSizeFemale ++;
        course.id = this.course.id;
        course.cid = c.cid;
        course.did = c.did;
        a.push(course);
      }
      return a;
     }, []);
    // console.log('studentList =', saveStudentList);
     if(!saveStudentList) {
      this.studentDialog.close();
      return;
     }

     this.courseService.addStudent(saveStudentList).subscribe(
      (response: HttpResponseData) => {
        if (response.status) {
        //  this.utilityService.showSuccess('Success', 'Save Successfully');
          this.studentDialog.close();
          this.save();
          this.getStudentByCourseId(this.course.id);
          this.isNew = false;
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

  removeStudent(student: Student) {
    this.confirmationService.confirm({
      key: 'globalConfirm',
      message:
        'Are you sure that you want to remove ',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      accept: () => {
        const course = _.cloneDeep(this.course);
        course.cid = student.cid;
        course.did = student.did;
        this.courseService.removeStudent(course).subscribe(
          (response: HttpResponseData) => {
            if(response.status) {
            //  this.utilityService.showSuccess('Success','Remove Successfully');
              student.gender === 'M' ? this.course.cohortSizeMale -- : this.course.cohortSizeFemale --;
              this.save();
              this.getStudentByCourseId(this.course.id);
            } else {
              this.utilityService.showError('Error', response.message)
            }
          }, (error: any) => {
            this.utilityService.subscribeError(error, 'Unable to remove')

          }, () => {
            this.utilityService.hideLoading();
          }
        );
      },
    });

    // removeStudent
  }
}
