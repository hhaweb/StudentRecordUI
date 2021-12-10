import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentDetails } from 'src/app/model/student/student.model';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
 isEditable: boolean;
   
  //studentDetails:StudentDetails[];
  studentDetails=[{courseStatus:"Active",cid:"CID-1001",sector:"A",
   courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"},
   {courseStatus:"Active",cid:"CID-1001",sector:"A",
   courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"},
   {courseStatus:"Active",cid:"CID-1001",sector:"A",courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"},
   {courseStatus:"Active",cid:"CID-1001",sector:"A",
   courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"},
   {courseStatus:"Active",cid:"CID-1001",sector:"A",
   courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"},
   {courseStatus:"Active",cid:"CID-1001",sector:"A",courseLevel:"Level 2",duration:"3 Months",startDate:"2021-01-01",endDate:"2022-01-01"}]
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isEditable =  this.route.snapshot.paramMap.get('type') == 'view'? false : true; 
  }

}
