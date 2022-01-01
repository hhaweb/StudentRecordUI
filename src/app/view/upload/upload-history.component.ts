import { UploadService } from './../../service/controller-service/upload.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadHistory } from 'src/app/model/upload/upload.model';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-upload-history',
  templateUrl: './upload-history.component.html',
  styleUrls: ['./upload-history.component.scss']
})
export class UploadHistoryComponent implements OnInit {
  @ViewChild('dt', { static: true }) dataTable: Table;
  uploadHistoryList: UploadHistory[] = [];
  tableLoading: boolean;
  totalRecords: number;

  constructor(
    private uploadService: UploadService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    this.totalRecords = 0;
    this.uploadHistoryList = [];
    this.getUploadHistory();
  }

  getUploadHistory() {
    this.tableLoading = true;
    this.uploadService.getUploadHistory().subscribe(
      (res: UploadHistory[]) => {
        this.uploadHistoryList = res;
        this.totalRecords = res.length;
        console.log('this.uploadHistoryList', this.totalRecords)
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to load upload history');
      }, () => {
        this.tableLoading = false;
      }
    );
  }

  showAll() {
    console.log('enter', this.uploadHistoryList)
    this.dataTable.clear();
    this.dataTable.reset();
    this.getUploadHistory();
  }

  download(id: number,type: string) {
    this.utilityService.showLoading('Downloading')
    this.uploadService.downloadFile(id.toString(), type).subscribe(
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
