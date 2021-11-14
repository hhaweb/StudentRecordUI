import { LoadingBarModel } from 'src/app/model/config-model/loading-bar-model';
import { UtilityService } from './../../service/utility/utility.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

 
  loadingMessage: string;
  showCancelButton: boolean;
  showLoading: boolean;
  cancelAction: () => void;
  subscription: Subscription;

  constructor(private utilityService: UtilityService) {}

  ngOnInit() {
    this.showLoading = false;
    this.subscribeToLoadingChange();
  }

  subscribeToLoadingChange() {
    this.subscription = this.utilityService.loadingChange.subscribe(
      (loadingBarModel: LoadingBarModel) => {
        this.showLoading = loadingBarModel.showLoading;
        this.loadingMessage = loadingBarModel.loadingMessage;
        this.showCancelButton = loadingBarModel.showCancelButton;
        this.cancelAction = loadingBarModel.cancelAction;
      }
    );
  }

  cancelClick() {
    this.cancelAction();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
