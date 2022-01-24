import { RoutesModel } from './../../model/config-model/route-model';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import { forkJoin } from 'rxjs';
import { AuthorizationService } from './../../service/utility/authorization.service';
import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Student } from 'src/app/model/student/student.model';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import * as moment from 'moment';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})



export class StudentProfileComponent implements OnInit {

  availableBatches: SelectItem[];
  availableBloodGroups: SelectItem[];
  availableMaritalStatues: SelectItem[];
  availableTrainingYears: SelectItem[];
  availableGender: SelectItem[];
  currentDate: Date;
  imageSrc: string;
  selectedGender: string;
  student: Student;
  yearRange: string;
  isEditable: boolean;
  selectedDateOfBirth: Date;
  title: string = "Create new student";
  constructor(private studentService: StudentService,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService,
    private router: Router) {

  }

  ngOnInit() {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.initializeForm();
  }

  initializeForm() {
    this.yearRange = '1920:' + new Date().getFullYear().toString();
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

    this.availableGender = [{label: 'Male', value: 'M'}, {label: 'Female', value: 'F'}];

    this.student = new Student();
    this.currentDate = new Date();
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
  }


  create() {
    if(!this.student.name || this.student.name.trim() == '') {
      this.utilityService.showWarning('Warning','Please add name');
      return;
    }
  
    if(!this.student.cid || this.student.cid.trim() == '') {
      this.utilityService.showWarning('Warning','Please add cid');
      return;
    }

    if(!this.student.did || this.student.did.trim() == '') {
      this.utilityService.showWarning('Warning','Please add did');
      return;
    }

    if(this.student.email) {
      if(!this.validateEmail(this.student.email)) {
        this.utilityService.showWarning('Warning','Invalid email');
        return;
      }
    }

    this.utilityService.showLoading('Saving...')
    this.student.dateOfBirth = this.selectedDateOfBirth ? moment(this.selectedDateOfBirth).format('DD/MM/yyyy') : null;
    if(this.student.id) {
      this.student.inDate  = new Date();
    }
    this.studentService.saveStudent(this.student).subscribe(
      (response: HttpResponseData) => {
        if (response.status) {
          this.utilityService.showSuccess('Success', 'Save Successfully')
          if(response.id) {
            this.getStudentById(response.id);
          }
        }
        else {
          this.utilityService.showError("Save fail", response.message);
        }
      }, (error: any) => {
        this.utilityService.showError(error, 'Unable to Save')
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

  getStudentById(studentId: string) {
    this.utilityService.showLoading('Loading...');
    this.studentService.getStudentById(studentId).subscribe(
      (res: Student) => {
        if(res) {
           this.student = res;
           this.title = res.name;
           if(res.dateOfBirth) {
             this.selectedDateOfBirth = moment(this.student.dateOfBirth, 'DD/MM/yyyy').toDate();
           }
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

  clear() {
    this.student = new Student();
    this.student.gender = "Male";
    void this.router.navigate([`${RoutesModel.StudentList}`]);
  }

  validateEmail(email: string) {
    if (email) {
      const emailList = email.split(',');
      const pattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
      for (const x of emailList) {
        if (!x.trim().match(pattern)) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
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
