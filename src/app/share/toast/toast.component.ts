import { environment } from './../../../environments/environment';
import { UtilityService } from './../../service/utility/utility.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent  {

  dialogTitle = '';
  dialogContentHTML = '';
  dialogDisplay = false;

  confirmTitle = '';
  confirmContentHTML = '';

  errorSidebarMessage = '';
  openErrorSidebar = false;

  constructor(
    private messageService: MessageService,
    private utilityService: UtilityService
  ) {
    this.utilityService.displayDialogService.subscribe((input: any) => {
      this.displayDialog(input.title, input.contentHTML);
    });
    this.utilityService.displayErrorSidebarService.subscribe(
      (input: any) => {
        this.openSidebar(input.errorMessage);
      }
    );
  }

  openSidebar(errorMessage: any) {
    this.errorSidebarMessage = errorMessage;
    this.openErrorSidebar =
      environment.environmentName === 'PRODUCTION' ? false : true;
  }

  displayDialog(title: string, contentHTML: string) {
    this.dialogTitle = title;
    this.dialogContentHTML = contentHTML;
    this.dialogDisplay = true;
  }

  copyErrorMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  close() {
    this.messageService.clear();
  }

}
