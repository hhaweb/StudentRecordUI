import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})

export class StudentProfileComponent implements OnInit {

  selectedGender:string;

  constructor() {
     
  }

  ngOnInit() {
   
  }

 

}
