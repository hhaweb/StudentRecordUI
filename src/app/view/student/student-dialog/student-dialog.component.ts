import { RoutesModel } from 'src/app/model/config-model/route-model';
import { UtilityService } from './../../../service/utility/utility.service';
import { StudentService } from 'src/app/service/controller-service/student.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SearchModel } from 'src/app/model/common/common.model';
import { Student } from 'src/app/model/student/student.model';
import { Table } from 'primeng/table';
import { Course } from 'src/app/model/student/course.model';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';

@Component({
  selector: 'student-dialog',
  templateUrl: './student-dialog.component.html',
  styleUrls: ['./student-dialog.component.scss']
})
export class StudentDialogComponent implements OnInit {
  @ViewChild('dt', { static: true }) dataTable: Table;
  @Input() course: Course;
  @Output() saveEvent = new EventEmitter<Student[]>();

  showDialog: boolean;
  header: string;
  students: Student[];
  selectedStudentList: Student[];
  totalStudents: number;
  tableLoading: boolean;
  studentSearchKeyWord: string;

  constructor(
    private studentService: StudentService,
    private utilService: UtilityService,
    private router: UtilityService
  ) { }

  ngOnInit(): void {
    this.students = [];
    this.selectedStudentList = [];
    this.totalStudents = 0;
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'inDate';
    inputModel.sortType = 1;
    this.getStudentList(inputModel);
    setTimeout(() => {
      this.header = "Add student to course " +this.course.courseId;
    }, 1000);
  }

  addStudent(student: Student) {
    const index = this.selectedStudentList.findIndex(a => a.id == student.id);
    if(index == -1) {
      student.avatar
      student.base64Image
      this.selectedStudentList.push(student);
      //console.log('selected student =', this.selectedStudentList);
    }
  }

  remove(student: Student) {
    this.selectedStudentList = this.selectedStudentList.filter(a => a.id != student.id);
  }

  search(searchType: string) {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'inDate';
    inputModel.sortType = 1;
    inputModel.searchKeyword = this.studentSearchKeyWord ? this.studentSearchKeyWord.trim() : null;
    this.getStudentList(inputModel);
  }

  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'inDate';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getStudentList(inputModel);
  }

  getStudentList(inputModel: SearchModel) {
    this.tableLoading = true;
    this.students = [];
    this.studentService.getStudentList(inputModel).subscribe(
      (response: Student[]) => {
       if (response?.length > 0) {
        this.students = response;
        this.totalStudents = response[0].totalRecord;
       }
      
      },
      (error: any) => {
        this.tableLoading = false;
        this.utilService.subscribeError(error, 'Unable to load students')
      },
      () => {
        this.tableLoading = false;
      }
    )
  }

  openDialog() {
    this.showDialog = true;
  }

  close() {
    this.showDialog = false;
    this.students = [];
    this.selectedStudentList = [];
    this.totalStudents = 0;
    this.dataTable.clear();
    this.studentSearchKeyWord = null;
  }

  save() {
    this.saveEvent.emit(this.selectedStudentList);
  }
}
