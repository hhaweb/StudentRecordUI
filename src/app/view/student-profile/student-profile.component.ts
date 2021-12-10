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

  availableBatches: SelectItem[];
  availableBloodGroups: SelectItem[];
  availableMaritalStatues: SelectItem[];
  availableTrainingYears: SelectItem[];
  imageSrc: string;
  selectedGender: string;
  student: StudentInput;
  constructor(private studentService: StudentService,
              private utilityService: UtilityService,
              private router: Router) {
     
  }

  ngOnInit() {
   

  this.availableTrainingYears = 
  [{label:"2018",value: "2018"},
  {label:"2019",value: "2019"},
  {label:"2020",value: "2020"},
  {label:"2021",value: "2021"},
 ]
  this.availableBatches =
          [{label:"Batch 1",value: "Batch 1"},
          {label:"Batch 2",value: "Batch 2"},
          {label:"Batch 3",value: "Batch 3"},
          {label:"Batch 4",value: "Batch 4"},
          {label:"Batch 5",value: "Batch 5"}]

  this.availableBloodGroups =
  [{label:"A",value: "A"},
  {label:"AB",value: "AB"},
  {label:"B",value: "B"},
  {label:"O",value: "O"},
 ]

 this.availableMaritalStatues =
  [{label:"Single",value: "Single"},
  {label:"Married",value: "Married"},
  {label:"Divorced",value: "Divorced"},
  {label:"Widowed",value: "Widowed"},
 ]

   
   this.student = new StudentInput();
   this.student.gender = "Male";
  }

  onPhotoUpload(event: any){
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result.toString();

      reader.readAsDataURL(file);
    }
  }
  
  removeImage(element) {
    this.imageSrc = null;
    element.value = '';
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
