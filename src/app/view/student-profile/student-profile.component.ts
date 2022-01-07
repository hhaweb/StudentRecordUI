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
  imageSrc: string;
  selectedGender: string;
  student: Student;
  yearRange: string;
  constructor(private studentService: StudentService,
    private utilityService: UtilityService,
    private router: Router) {

  }

  ngOnInit() {

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


    this.student = new Student();
    this.student.gender = "Male";
  }

  onPhotoUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      this.imageSrc = reader.result.toString();
      this.student.avatar = this.imageSrc;
    }
  }
  }

  removeImage(element) {
    this.imageSrc = null;
    element.value = '';
  }


  addStudent() {
    console.log('call api', this.student);
    this.utilityService.showLoading('Saving...')
    console.log("dateofbirth before", this.student.dateOfBirth)
    if (this.student.dateOfBirth)
      this.student.dateOfBirth = moment(new Date(this.student.dateOfBirth)).format('DD/MM/yyyy');
    console.log("dateofbirth after", this.student.dateOfBirth)
    this.studentService.saveStudent(this.student).subscribe(
      (response: HttpResponseData) => {
        if (response.status) {
          this.utilityService.showSuccess('Success', 'Save Successfully')
        }
        else {

        }
      }, (error: any) => {
        this.utilityService.showError(error, 'Unable to Save')
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

  clear() {
    this.student = new Student();
    this.student.gender = "Male";
  }



}
