import { HttpResponseData } from './../../model/config-model/response.data';
import { UtilityService } from './../../service/utility/utility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadService } from 'src/app/service/controller-service/upload.service';
import { FileUpload } from 'primeng/fileupload';
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
  courseUploadFile: any;
  studentUplaodFile: any;
  studentResult: UploadResult;
  constructor(
    private uploadService: UploadService,
    private utilityService: UtilityService,
    private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onUploadEvent(event: any, type: string){
    if(type === 'student') {
      this.studentUplaodFile = event.files[0];
      this.uploadStudentFile();
    } else {
      this.courseUploadFile = event.files[0];
    }
  }

  uploadStudentFile() {
    console.log('call upload api');
    const formData = new FormData();
    formData.append('file', this.studentUplaodFile,this.studentUplaodFile.name);
    this.utilityService.showLoading('Uploading...')
    this.uploadService.uploadStudentFile(formData).subscribe(
      (response: HttpResponseData) => {
        if (response.status) {
          this.studentResult = response.payLoad;
        } else {

        }
        
        this.utilityService.showSuccess('Success', 'Upload Successfully')
      },(error: any) => {
        this.utilityService.subscribeError(error, 'Unable to upload');
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
    this.clear();
  }

  goToStudentList() {
  ////  this.utilityService.showLoading('Uploading...')

  }

  clear() {
    this.studentFile.clear();
    this.courseFile.clear();
    this.studentUplaodFile = null;
    this.courseUploadFile = null;
  }

  downloadErrorFile() {
    this.uploadService.downloadFile('').subscribe(
      (res: any) => {
        this.utilityService.hideLoading();
        if (res.body) {
          this.utilityService.fileSaveAs(res);
        } else {
          this.utilityService.showWarning('Warning', 'File not found');
        }
      },
      (error: any) => {
        setTimeout(() => this.utilityService.hideLoading());
        this.utilityService.subscribeError(
          error,
          'Unable to download file'
        );
      },
      () => {
        this.utilityService.hideLoading();
      }
    );
  }

}
// test