import { forkJoin } from 'rxjs';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { Router } from '@angular/router';
import { CourseService } from './../../service/controller-service/course.service';
import { Trainer } from './../../model/student/trainer.model';
import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { SearchModel } from 'src/app/model/common/common.model';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.scss']
})
export class TrainerListComponent implements OnInit {
  @Input()
  isShowAll: boolean = true;
  trainerList: Trainer[];
  tableLoading: boolean;
  totalRecord: number;
  searchKeyWord: string;
  isEditable: boolean;
  constructor(
    private courseService: CourseService,
    private router: Router,
    private utilityService: UtilityService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
    this.trainerList = [];
    if(this.isShowAll) {
      this.DefaultSearch();
    }
  }

  DefaultSearch() {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'trainerName';
    inputModel.sortType = 1;
    this.getTrainerList(inputModel);
  }

  searchFromStudent(key: string) {
    const inputModel = new SearchModel();
    inputModel.rowOffset = 0;
    inputModel.rowsPerPage = 50;
    inputModel.sortName = 'trainerName';
    inputModel.sortType = 1;
    inputModel.searchKeyword = key;
    this.getTrainerList(inputModel);
  }

  lazyLoadEvent(event: any) {
    const inputModel = new SearchModel();
    inputModel.rowsPerPage = event.rows;
    inputModel.rowOffset = event.first / event.rows;
    inputModel.sortName = event.sortField ? event.sortField : 'trainerName';
    inputModel.sortType = event.sortOrder ? event.sortOrder : 1;
    this.getTrainerList(inputModel);
  }

  getTrainerList(inputModel: SearchModel) {
    this.tableLoading = true;
    this.trainerList = []
    this.courseService.getTrainerList(inputModel).subscribe(
      (response: Trainer[]) => {
        if (response && response.length > 0) {
          this.trainerList = response;
          this.totalRecord = response[0].totalRecords;
        }
      }, (error: any) => {
        this.tableLoading = false;
        this.utilityService.subscribeError(error, 'Unable to load trainer list');
      },
      () => {
        this.tableLoading = false;
      }
    );
  }

  delete(trainer: Trainer) {

  }

  create() {
    void this.router.navigate([`${RoutesModel.TrainerDetail}`]);
  }

  edit(id: number) {
    void this.router.navigate([`${RoutesModel.TrainerDetail}/${id}`]);
  }

  search() {
    if (this.searchKeyWord) {
      const inputModel = new SearchModel();
      inputModel.rowOffset = 0;
      inputModel.rowsPerPage = 50;
      inputModel.sortName = 'trainerName';
      inputModel.sortType = 1;
      inputModel.searchKeyword = this.searchKeyWord.trim();
      this.getTrainerList(inputModel);
    }
  }

  showAll() {
    this.searchKeyWord = null;
    this.DefaultSearch();
  }

}
