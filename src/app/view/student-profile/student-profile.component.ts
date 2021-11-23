import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { StudentInput } from 'src/app/model/student/student.model';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})

export class StudentProfileComponent implements OnInit {

  selectedGender: string;
  student: StudentInput;
  constructor(private studentService: StudentService,
              private utilityService: UtilityService,
              private router: Router) {
     
  }

  ngOnInit() {
   this.student = new StudentInput();
   this.student.gender = "Male";
   //this.student.dateOfBirth = new Date();
  }

  onPhotoUpload(event: any){
    console.log(event.files);
   //this.student.avatar = event.files
  }

  addStudent(){
   console.log('call api', this.student);
   this.utilityService.showLoading('Saving...')
   this.studentService.createStudent(this.student).subscribe(
     (response: HttpResponseData) =>{
       if(response.status){
        this.utilityService.showSuccess('Success', 'Save Successfully')
       }
       else{

       }
     },(error: any) => {
      this.utilityService.showError(error,'Unable to Save')
     },
     () => {
       this.utilityService.hideLoading();
     }
   );
  }

  clear(){
     this.student = new StudentInput();
     this.student.gender = "Male";
  }

 

}
