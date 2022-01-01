import { UtilityService } from './../utility/utility.service';
import { APIUrls } from 'src/app/model/config-model/api-url';
import { HttpResponseData } from './../../model/config-model/response.data';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { UploadHistory } from 'src/app/model/upload/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private httpClient: HttpClient,
    private utilService: UtilityService) { }

  uploadData(formData: FormData): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.UploadUrls.UploadData, formData
    );
  }

  downloadFile(fileId: string, type: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('fileId', fileId);
    params = params.append('type', type);
    return this.httpClient
      .get(APIUrls.UploadUrls.DownloadUploadFile,{
        responseType: 'blob',
        observe: 'response',
        params
      })
      .pipe(
        catchError((res: any) => {
          return this.utilService.convertBlobToText(res.error);
        })
      );
  }

  getUploadHistory(): Observable<UploadHistory[]> {
    return this.httpClient.get<UploadHistory[]>(
      APIUrls.UploadUrls.GetUploadHistory
    );
  }
}
