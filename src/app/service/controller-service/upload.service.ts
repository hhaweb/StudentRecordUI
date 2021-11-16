import { UtilityService } from './../utility/utility.service';
import { APIUrls } from 'src/app/model/config-model/api-url';
import { HttpResponseData } from './../../model/config-model/response.data';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private httpClient: HttpClient,
    private utilService: UtilityService) { }

  uploadStudentFile(formData: FormData): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.UploadUrls.UploadStudent,formData
    );
  }

  downloadFile(fileId: string): any {
    let params = new HttpParams();
    params = params.append('fileId', fileId);

    return this.httpClient
      .get(APIUrls.UploadUrls.DownloadStudentErrorFile,{
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
}
