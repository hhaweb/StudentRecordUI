import { forkJoin } from 'rxjs';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { SelectItem } from 'primeng/api';
import { Student } from './../../model/student/student.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/model/student/course.model';
import * as moment from 'moment';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  isEditable: boolean;
  student: Student;
  courseList: Course[];
  yearRange: string;
  isNew: boolean;
  dateOfBirth: Date;
  studentId: string;
  isStudent: boolean;

  availableGender: SelectItem[] = [];
  availableMartialStatus: SelectItem[] = [];
  availableStatus: SelectItem[] = [];


  constructor(private route: ActivatedRoute,
    private studentService: StudentService,
    private utilityService: UtilityService,
    private router: Router,
    private authorizationService: AuthorizationService) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        this.isStudent = currentUser.roleName === AppConfigData.StudentRole ? true : false;
      });
    this.initializeForm();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.studentId = params.id;
        this.isNew = false;
        this.getStudentById(params.id);
      } else {
        this.isNew = true;
      } 
    });
  }

  back() {
    // void this.router.navigate([`${RoutesModel.StudentDetails}/${this.studentId}/view`]);
    void this.router.navigate([RoutesModel.StudentList]);
  }

  save() {
    if(!this.student.name) {
      this.utilityService.showWarning('Warning','Please add Name');
      return;
    }
    if(!this.student.cid) {
      this.utilityService.showWarning('Warning','Please add CID');
      return;
    }
    if(!this.student.did) {
      this.utilityService.showWarning('Warning','Please add DID');
      return;
    }

    this.utilityService.showLoading('Saving');
    if(this.dateOfBirth) {
      this.student.dateOfBirth = moment(this.dateOfBirth).format('d/MM/yyyy');
    }
    this.studentService.saveStudent(this.student).subscribe(
      (res: HttpResponseData) => {
        if(res.status) {
          this.utilityService.showSuccess('Success', res.message)
          this.getStudentById(res.id);
        } else {
          this.utilityService.subscribeError('Save Fail', res.message);
        }
      },(error: any) => {
        this.utilityService.subscribeError(
        error,
        'Unable to save student'
      );
    },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

  initializeForm() {
    this.student = new Student();
    this.courseList = [];
    this.yearRange = '1920:'+new Date().getFullYear().toString();
    this.availableGender = [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}];
    this.availableMartialStatus = [{label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'},
    {label: 'Select', value: 'Select'},{label: 'Divorced', value: 'Divorced'},{label: 'Widowed', value: 'Widowed'}];
    this.availableStatus = [{label: 'Active', value: '1'}];
  }

  getStudentById(studentId: string) {
     this.utilityService.showLoading('Loading...');
     this.studentService.getStudentById(studentId).subscribe(
       (res: Student) => {
         if(res) {
            this.student = res;
            if(res.dateOfBirth) {
              this.dateOfBirth = new Date(res.dateOfBirth);
            }
            this.courseList = res.courseList ? res.courseList: [];
           this.utilityService.hideLoading();
         }
       },(error: any) => {
       this.utilityService.hideLoading()
         this.utilityService.subscribeError(
         error,
         'Unable to load student'
       );
     },
       () => {
         this.utilityService.hideLoading();
       }
     );
   }
}
