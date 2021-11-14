import { APIUrls } from 'src/app/model/config-model/api-url';
import { HttpResponseData } from './../../model/config-model/response.data';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient) { }

  uploadStudentFile(formData: FormData): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.UploadUrls.UploadStudent,formData
    );
  }
}
