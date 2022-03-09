import { HttpResponseData } from './../../model/config-model/response.data';
import { CommonService } from './../../service/controller-service/common.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { DropDownItem } from './../../model/common/common.model';
import { Component, Input, OnInit } from '@angular/core';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { ThrowStmt } from '@angular/compiler';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dropdwon-list',
  templateUrl: './dropdwon-list.component.html',
  styleUrls: ['./dropdwon-list.component.scss']
})
export class DropdwonListComponent implements OnInit {
  @Input()
  dropDownItem: DropDownItem[];
  @Input()
  dropDownName: string;
  @Input()
  isEditable: boolean;

  constructor(
    private utilityService: UtilityService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }


  save() {
    if(!this.dropDownName) {
      this.utilityService.showWarning('Warning',"Please add name");
      return;
    }

    if(!this.dropDownItem || this.dropDownItem.length == 0) {
      this.utilityService.showWarning('Warning',"Please add item");
      return;
    }
    this.dropDownItem.map(a => a.name = this.dropDownName);
    this.utilityService.showLoading('Saving');
    this.commonService.saveDropDownItem(this.dropDownItem).subscribe(
      (response: HttpResponseData) => {
        if(response.status) {
          this.utilityService.showSuccess('Success', "Save Successfully")
        } else {
          this.utilityService.showError('Error', "Unable to save");
        }
      },(error: any) => {
        this.utilityService.subscribeError(error,"Unable to save");
      },() => {
        this.utilityService.hideLoading();
      }
    );
  }

  remove(index: number) {
    this.dropDownItem.splice(index, 1);
  }

  add() {
    if(!this.dropDownName) {
      this.utilityService.showWarning('Warning', 'Add dropdown Name');
      return;
    }
    this.dropDownItem.push(new DropDownItem(this.dropDownName));
  }


  delete() {
    if(!this.dropDownName) {
      this.utilityService.showWarning('Warning', 'Please select dropdown name');
      return;
    }

    this.confirmationService.confirm({
      key: 'globalConfirm',
      message:
        'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      accept: () => {
        this.utilityService.showLoading('Deleting')
        this.commonService.deleteDropDown(this.dropDownName).subscribe(
          (response: HttpResponseData) => {
            if(response.status) {
              this.utilityService.showSuccess('Success', 'Delete Successfully')
              this.dropDownItem = [];
              this.dropDownName = null;
            } else {
              this.utilityService.showError('Error', "Unable to delete")
            }
          }, (error: any) => {
            this.utilityService.subscribeError(error,"Unable to delete")
          } ,() => {
            this.utilityService.hideLoading();
          }
        );
      },
    });
  }

}
