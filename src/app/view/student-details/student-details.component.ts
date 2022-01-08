import { CourseService } from './../../service/controller-service/course.service';
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
import { Employment } from 'src/app/model/student/employment.model';
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  isEditable: boolean;
  student: Student;
  courseList: Course[];
  recommendedCourseList: Course[];
  employment: Employment;
  yearRange: string;
  isNew: boolean;
  studentId: string;
  isStudent: boolean;


  availableGender: SelectItem[] = [];
  availableMartialStatus: SelectItem[] = [];
  availableStatus: SelectItem[] = [];
  availableEmploymentStatus: SelectItem[] =[];
  availableOrganizationType: SelectItem[] =[];
  availableBloodGroups: SelectItem[];
  availableMaritalStatues: SelectItem[];
  title: string = "Create New Student";


  constructor(private route: ActivatedRoute,
    private studentService: StudentService,
    private courseService: CourseService,
    private utilityService: UtilityService,
    private router: Router,
    private authorizationService: AuthorizationService) { }

  ngOnInit(): void {
    this.availableBloodGroups =
    [
      { label: "A-", value: "A-" },
      { label: "AB-", value: "AB-" },
      { label: "B-", value: "B-" },
      { label: "O-", value: "O-" },

      { label: "A+", value: "A+" },
      { label: "AB+", value: "AB+" },
      { label: "B+", value: "B+" },
      { label: "O+", value: "O+" }
    ]

  this.availableMaritalStatues =
    [{ label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
    { label: "Divorced", value: "Divorced" },
    { label: "Widowed", value: "Widowed" },
    ]
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
    console.log('oninit',this.student)
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

    if(this.employment.status || this.employment.organizationType || this.employment.organizationName) {
      this.employment.cid = this.student.cid;
      this.student.employment = this.employment;
      this.student.updatedDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
    }
 

    this.utilityService.showLoading('Saving');
    this.student.dateOfBirth = moment(this.student.dateOfBirth).format('DD/MM/yyyy');
    this.student.inDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
    this.student.updatedDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
   
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
    this.employment = new Employment();
    this.courseList = [];
    this.recommendedCourseList = [];
    this.yearRange = '1920:'+new Date().getFullYear().toString();
    this.availableGender = [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}];
    this.availableMartialStatus = [{label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'},
    {label: 'Select', value: 'Select'},{label: 'Divorced', value: 'Divorced'},{label: 'Widowed', value: 'Widowed'}];
    this.availableStatus = [{label: 'Active', value: '1'}];
    this.availableEmploymentStatus = [{label: 'FT',value: 'FT'},{label: 'PT',value: 'PT'},{label: 'Intern',value: 'Intern'},{label: 'OJT',value: 'OJT'}]
    this.availableOrganizationType = [{label: 'Gov',value: 'Gov'},{label: 'Private',value: 'Private'}]
  }

  getStudentById(studentId: string) {
     this.utilityService.showLoading('Loading...');
     this.studentService.getStudentById(studentId).subscribe(
       (res: Student) => {
         if(res) {
           this.title = 'Detalis Information of ' +res.name; 
            this.student = res;
            if(res.employment)
            this.employment  = res.employment
            
            this.getCoursesByCid(res.cid);
            this.getRecommendedCourses(res.cid);
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
   
   getCoursesByCid(cid: string) {
     this.courseList = [];
     this.courseService.getCourseByCid(cid).subscribe(
       (response: Course[]) => {
         if(response.length > 0) {
           this.courseList = response;
         }
       }, (error: any) => {
         this.utilityService.subscribeError(error, 'Unable to load course');
       }, () => {

       }
     );
   }

   getRecommendedCourses(cid: string) {
    this.courseList = [];
    this.courseService.getRecommendedCourses(cid).subscribe(
      (response: Course[]) => {
        if(response.length > 0) {
          this.recommendedCourseList = response;
          console.log('recommend =>',this.recommendedCourseList)

        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load recommend');
      }, () => {

      }
    );
  }

  export() {
    this.utilityService.showLoading('Exporting');
    if(this.student) {
      this.studentService.exportStudentDetail(this.student.id).subscribe(
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
 
  saveEmployment(){
    this.utilityService.showLoading('Saving');
    this.student.employment = this.employment;
    this.student.updatedDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
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
        'Unable to save employment'
      );
    },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }
}
