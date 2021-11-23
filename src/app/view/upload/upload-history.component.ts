import { Component, OnInit } from '@angular/core';
import { UploadHistory } from 'src/app/model/upload/upload.model';

@Component({
  selector: 'app-upload-history',
  templateUrl: './upload-history.component.html',
  styleUrls: ['./upload-history.component.scss']
})
export class UploadHistoryComponent implements OnInit {
  uploadHistoryList: UploadHistory[] = [];
  tableLoading: boolean;
  totalRecords: number;

  constructor() { }

  ngOnInit(): void {
    this.totalRecords = 100;
    for (let index = 0; index < 100; index++) {
      const upload = new UploadHistory();
      upload.id = 10;
      upload.fileName = "Upload File"
      upload.totalRecord = 100;
      upload.failRecord = 10;
      upload.successRecord = 90;
      upload.errorFileName = 'Error File Name';
      upload.uploadDate = new Date();
      this.uploadHistoryList.push(upload);
    }
  }




}
