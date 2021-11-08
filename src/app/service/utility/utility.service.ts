import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { LoadingBarModel } from 'src/app/model/config-model/loading-bar-model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  public displayDialogService = new Subject<any>();
  public displayErrorSidebarService = new Subject<any>();
  public loadingChange: Subject<any> = new Subject<any>();
  loadingCount = 0;

  constructor(
    private messageService: MessageService,
    // private globalDataService: GlobalDataService,
    // private systemMessagesLoadedEvent: SystemMessagesLoadedEvent,
    private pageTitleService: Title
  ) { }

  setPageTitle(newTitle: string) {
    this.pageTitleService.setTitle(newTitle);
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      key: 'globalToast',
      severity: 'success',
      summary,
      detail,
    });
  }

  showWarning(summary: string, detail: string) {
    this.messageService.add({
      key: 'globalToast',
      severity: 'warn',
      summary,
      detail,
    });
  }

  showInfo(summary: string, detail: string) {
    this.messageService.add({
      key: 'globalToast',
      severity: 'info',
      summary,
      detail,
    });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({
      key: 'globalToast',
      severity: 'error',
      summary,
      detail,
    });
  }

  
  showLoading(
    loadingMessage: string,
    showCancelButton = false,
    cancelAction: () => void = null
  ) {
    const loadingBarModel = new LoadingBarModel();
    loadingBarModel.showLoading = true;
    loadingBarModel.loadingMessage = loadingMessage;
    loadingBarModel.showCancelButton = showCancelButton;
    loadingBarModel.cancelAction = cancelAction;
    this.loadingCount++;
    if (this.loadingCount > 0) {
      setTimeout(() => {
        this.loadingChange.next(loadingBarModel);
      }, 0);
    }
  }

  hideLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      const loadingBarModel = new LoadingBarModel();
      loadingBarModel.showLoading = false;
      loadingBarModel.loadingMessage = '';
      loadingBarModel.showCancelButton = false;
      setTimeout(() => this.loadingChange.next(loadingBarModel), 0);
    }
  }

  subscribeError(error: any, errorMessage: string) {
    this.hideLoading();
    if (errorMessage) {
      this.showError('Error', errorMessage);
    }
  }

  errorSidebarOpen(err_msg: string) {
    this.displayErrorSidebarService.next({ errorMessage: err_msg });
  }

  showErrorModal(summary: string, detail: string) {
    this.messageService.clear();
    this.messageService.add({
      key: 'globalErrorToast',
      sticky: true,
      severity: 'error',
      summary,
      detail,
    });
  }
}
