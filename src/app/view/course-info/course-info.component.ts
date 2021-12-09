import { Component, Input, OnInit } from '@angular/core';
import { StudentFilter, StudentOutput } from 'src/app/model/student/student.model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Router } from '@angular/router';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { StudentService } from 'src/app/service/controller-service/student.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {

  @Input() courseID: string;
  students: StudentOutput[];
  selectedStudent: StudentOutput;
  studentInput: StudentFilter;
  totalStudents = 0;
  selectedStudentID: string;
  selectedCourseID: string;

  constructor(private studentService: StudentService,
    private utilService: UtilityService,
    private router: Router) { }

    ngOnInit(): void {

      this.DefaultSearch();
    }
  
    DefaultSearch() {
      const inputModel = new StudentFilter();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'name';
      inputModel.sortType = 1;
      this.getAllStudents(inputModel);
    }
  
  
    lazyLoadEvent(event: any) {
     /*this.studentService.getStudentList().subscribe(
  
     )*/
    }
  
    getAllStudents(inputModel: StudentFilter){
       this.studentService.getStudentList(inputModel).subscribe(
         (response: any) =>{
           this.students = [];
           console.log(response.payLoad.students)
           if(response.payLoad.students && response.payLoad.students.length>0)
            this.students = response.payLoad.students;
            this.totalStudents = response.payLoad.totalStudents;
         },
         (error: any) =>{
           this.utilService.subscribeError(error,'Unable to load students')
         }
       )
    }
  
    viewStudent(){
      void this.router.navigate([RoutesModel.StudentDetails]);
    }
  
    editStudent(){
      if(this.selectedCourseID){
         void this.router.navigate([RoutesModel.CourseInfo]);
      }
    }
    
    editCourse(){
  
    }

}
