import { CommonService } from '../../../service/controller-service/common.service';
import { CourseService } from '../../../service/controller-service/course.service';
import { forkJoin } from 'rxjs';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { SelectItem } from 'primeng/api';
import { Student } from '../../../model/student/student.model';
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
  selectedDateOfBirth: Date;
  imageSrc: any;
  currentDate: Date;

  availableGender: SelectItem[] = [];
  availableMartialStatus: SelectItem[] = [];
  availableStatus: SelectItem[] = [];
  availableEmploymentStatus: SelectItem[] =[];
  availableOrganizationType: SelectItem[] =[];
  availableBloodGroups: SelectItem[];
  availableMaritalStatues: SelectItem[];
  title: string = "Create New Student";
  isViewOnly: boolean;

  constructor(private route: ActivatedRoute,
    private studentService: StudentService,
    private courseService: CourseService,
    private utilityService: UtilityService,
    private router: Router,
    private authorizationService: AuthorizationService,
    private commonService: CommonService) { }

  ngOnInit(): void {

    const loadCurrentCuser = this.authorizationService.currentUser();
    const studentStatus = this.studentService.getStudentStatus();
    const loadEmploymentStatus = this.commonService.getDropDownItem("Employment Status");
    const loadOrganizationType = this.commonService.getDropDownItem("Organization Type");
    this.initializeForm();
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.studentId = params.id;
        this.isViewOnly = params.type == 'view' ? true : false;
        this.isNew = false;
        this.getStudentById(params.id);
      } else {
        this.isNew = true;
      } 
    });

    forkJoin([loadCurrentCuser,studentStatus, loadEmploymentStatus, loadOrganizationType]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.availableStatus = data[1];
        this.availableEmploymentStatus = data[2];
        this.availableOrganizationType = data[3];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        this.isStudent = currentUser.roleName === AppConfigData.StudentRole ? true : false;
        console.log('currentUser.roleName =', currentUser.roleName)

        if(this.isViewOnly) {
          this.isEditable = false;
        }
      });

  }

  back() {
    // void this.router.navigate([`${RoutesModel.StudentDetails}/${this.studentId}/view`]);
    void this.router.navigate([RoutesModel.StudentList]);
  }

  save() {
    if(!this.student.name || this.student.name.trim() == '') {
      this.utilityService.showWarning('Warning','Please add Name');
      return;
    }
    if(!this.student.cid || this.student.cid.trim() == '') {
      this.utilityService.showWarning('Warning','Please add CID');
      return;
    }
    if(!this.student.did || this.student.did.trim() == '') {
      this.utilityService.showWarning('Warning','Please add DID');
      return;
    }
    this.student.cid = this.student.cid.trim();
    this.student.did = this.student.did.trim();
    if(this.employment.status || this.employment.organizationType || this.employment.organizationName) {
      this.employment.cid = this.student.cid;
      this.student.employment = this.employment;
      this.student.updatedDate = moment(new Date()).format('DD/MM/yyyy HH:mm');
    }
 
    this.student.dateOfBirth = this.selectedDateOfBirth ?  moment(this.selectedDateOfBirth ).format('DD/MM/yyyy') : null; 

    this.utilityService.showLoading('Saving');
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
    this.availableMartialStatus = [{label: '-', value: null}, {label: 'Single', value: 'Single'}, {label: 'Married', value: 'Married'},
    {label: 'Select', value: 'Select'},{label: 'Divorced', value: 'Divorced'},{label: 'Widowed', value: 'Widowed'}];
   // this.availableEmploymentStatus = [{label: 'FT',value: 'FT'},{label: 'PT',value: 'PT'},{label: 'Intern',value: 'Intern'},{label: 'OJT',value: 'OJT'}]
   // this.availableOrganizationType = [{label: 'Gov',value: 'Gov'},{label: 'Private',value: 'Private'}]
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
  this.currentDate = new Date();
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
            this.imageSrc = res.base64Image ? res.base64Image : res.avatar ? res.avatar : null;
            if(res.dateOfBirth) {
              this.selectedDateOfBirth = moment(this.student.dateOfBirth, 'DD/MM/yyyy').toDate();
            }
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
 
  onPhotoUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      this.imageSrc = reader.result.toString();
      this.student.base64Image = this.imageSrc;
    }
  }
  }

  removeImage(element) {
    this.imageSrc = null;
    element.value = '';
    this.student.base64Image = null;
  }

  checkBodDate() {
    const current = moment(new Date());
    const selectedDate = moment(this.selectedDateOfBirth);
    const yearDiff = current.diff(selectedDate, 'year');
    if(yearDiff < 16) {
      this.utilityService.showWarning('Warning', 'Date Of birth must be above 16 years old')
     setTimeout(() => {
      this.selectedDateOfBirth = null;
     }, 1000);
    }
  }
}
