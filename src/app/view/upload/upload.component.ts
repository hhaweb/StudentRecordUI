import { CommonService } from './../../service/controller-service/common.service';
import { UploadHistoryComponent } from './upload-history.component';
import { HttpResponseData } from './../../model/config-model/response.data';
import { UtilityService } from './../../service/utility/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadService } from 'src/app/service/controller-service/upload.service';
import { FileUpload } from 'primeng/fileupload';
import { Router } from '@angular/router';
import { RoutesModel } from 'src/app/model/config-model/route-model';
import { MessageService } from 'primeng/api';
import { UploadResult } from 'src/app/model/upload/upload.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('studentUplaodFile') studentFile: FileUpload;
  @ViewChild('courseUploadFile') courseFile: FileUpload;
  @ViewChild('trainerUploadFile') trainerFile: FileUpload;
  @ViewChild('uploadHistory', { static: true })
  uploadHistory: UploadHistoryComponent;

  uploadResult: UploadResult;
  constructor(
    private uploadService: UploadService,
    private utilityService: UtilityService,
    private router: Router,
    private messageService: MessageService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.uploadResult = new UploadResult();
  }

  onUploadEvent(event: any, type: string) {
    const uploadFile = event.files[0]
    if (uploadFile) {
      const formData = new FormData();
      formData.append('file', uploadFile, uploadFile.name);
      formData.append('uploadType', type);
      this.utilityService.showLoading('Uploading...')
      this.uploadService.uploadData(formData).subscribe(
        (response: HttpResponseData) => {
          if (response.status) {
            if(response?.payLoad) {
              this.uploadResult = response.payLoad;
            }
            this.utilityService.showSuccess('Success', 'Upload Successfully')
          } else {
            this.utilityService.showError('Error', response.message);
          }
          this.uploadHistory.getUploadHistory();

        }, (error: any) => {
          this.utilityService.subscribeError(error, 'Unable to upload');
          this.clear();
        },
        () => {
          setTimeout(() => {
            this.utilityService.hideLoading()
          });
          this.clear();
        }
      );
    }

  }

  goToStudentProfile() {
    void this.router.navigate([RoutesModel.StudentProfile]);
  }
  goToStudentList() {
    ////  this.utilityService.showLoading('Uploading...')
  }

  clear() {
    this.studentFile.clear();
    this.courseFile.clear();
    this.trainerFile.clear();
  }


  downloadSimple(name: string) {
    this.commonService.downloadSimpleUploadFile(name).subscribe(
      (res: any) => {
        this.utilityService.hideLoading();
        if(!res.headers.get('content-disposition')) {
          this.utilityService.subscribeError(
            'Error',
            'File not found'
          );  
        }
        this.utilityService.fileSaveAs(res);
      },
      (error: any) => {
        this.utilityService.subscribeError(
          error,
          'Unable to download attachment'
        );
        setTimeout(() => this.utilityService.hideLoading(),1000);
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }
}
// test