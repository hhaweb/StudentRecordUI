import { HttpResponseData } from './../../model/config-model/response.data';
import { AppConfigData } from './../../model/config-model/config-data';
import { forkJoin } from 'rxjs';
import { AuthorizationService } from './../../service/utility/authorization.service';
import { CommonService } from './../../service/controller-service/common.service';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { SelectItem } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownItem } from 'src/app/model/common/common.model';

@Component({
  selector: 'app-dropdwon-setup',
  templateUrl: './dropdwon-setup.component.html',
  styleUrls: ['./dropdwon-setup.component.scss']
})
export class DropdwonSetupComponent implements OnInit {
  @ViewChild('dropdownItem', { static: true })
  dropdownItem: DropdwonSetupComponent;

  
  availableName: SelectItem[];
  dropDownList: DropDownItem[];
  selectedName: string;
  isEditable: boolean;
  constructor(
    private utilityService: UtilityService,
    private commonService: CommonService,
    private authorizationService: AuthorizationService
  ) { }

  ngOnInit(): void {
    const loadCurrentuser = this.authorizationService.currentUser();
    const loadDropDownName = this.commonService.getDropDownName();
    forkJoin([loadCurrentuser, loadDropDownName]).subscribe(
      (data: any) => {
        const currentUser = data[0];
        this.availableName = data[1];
        this.isEditable = currentUser.roleName === AppConfigData.SuperAdminRole ? true : false;
      });
  }

  search() {
    if(!this.selectedName) {
      this.utilityService.showWarning('Warning', 'Please select dropdown name');
      return;
    }

    this.utilityService.showLoading("Loading");
    this.commonService.getDropDownItem(this.selectedName).subscribe(
      (response: DropDownItem[]) => {
        if(response?.length > 0) {
          this.dropDownList = response;
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load dropdown list');
      } ,() => {
        this.utilityService.hideLoading();
      }
    );
  }



  create() {
    this.dropDownList = [];
    this.selectedName = null;
    this.dropDownList.push(new DropDownItem(null))
    //console.log('this.dropdownList' , this.dropDownList)
  }
}
