import { SelectItem } from 'primeng/api';
import { repeat } from 'lodash';
import { forkJoin } from 'rxjs';
import { CourseService } from '../../../service/controller-service/course.service';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { Router, ActivatedRoute } from '@angular/router';
import { Trainer } from 'src/app/model/student/trainer.model';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { AuthorizationService } from 'src/app/service/utility/authorization.service';
import { AppConfigData } from 'src/app/model/config-model/config-data';
import * as moment from 'moment';

@Component({
  selector: 'app-trainer-detail',
  templateUrl: './trainer-detail.component.html',
  styleUrls: ['./trainer-detail.component.scss']
})
export class TrainerDetailComponent implements OnInit {
  trainer: Trainer;
  isEditable: boolean;
  trainerId: string;
  selectedJoinDate: Date;
  availableGender: SelectItem[] = [];
  isViewOnly: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private courseService: CourseService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.trainerId = params.id;
        this.isViewOnly = params.type == 'view' ? true : false;
        this.getTrainerById(params.id);
      }
    });
    this.availableGender = [{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}];
    this.trainer = new Trainer();
    const loadCurrentCuser = this.authorizationService.currentUser();
    forkJoin([loadCurrentCuser]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
        if(this.isViewOnly) {
          this.isEditable = false;
        }
      });
  }

  getTrainerById(id: string) {
    this.utilityService.showLoading('Loading');
    this.courseService.getTrainerById(id).subscribe(
      (response: Trainer) => {
        if(response) {
          this.selectedJoinDate = response.joinDate ? moment(response.joinDate, "DD/MM/yyyy").toDate() : null;
          this.trainer = response;
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load trainer');
      }, () => {
        this.utilityService.hideLoading();
      }
    );
  }

  saveTrainer() {
    if(!this.trainer.trainerId || this.trainer.trainerId.trim() == '') {
      this.utilityService.showWarning('Warning','Please add trainer id');
      return;
    }
    if(!this.trainer.trainerName || this.trainer.trainerName.trim() == '') {
      this.utilityService.showWarning('Warning','Please add trainer name');
      return;
    }
    this.trainer.trainerId = this.trainer.trainerId.trim();
    this.utilityService.showLoading('Saving');
    if(this.selectedJoinDate) {
      this.trainer.joinDate = moment(this.selectedJoinDate).format('DD/MM/yyyy');
    }
    this.courseService.saveTrainer(this.trainer).subscribe(
      (res: HttpResponseData) => {
        if(res.status) {
          this.utilityService.showSuccess('Success', res.message)
          this.getTrainerById(res.id);
        } else {
          this.utilityService.subscribeError('Save Fail', res.message);
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to save trainer');
      }, () => {
        this.utilityService.hideLoading();
      }
    );

  }

  cancel() {
    void this.router.navigate([`${RoutesModel.TrainerList}`]);
  }

}
