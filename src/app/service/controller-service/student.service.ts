import { UtilityService } from './../utility/utility.service';
import { APIUrls } from 'src/app/model/config-model/api-url';
import { HttpResponseData } from './../../model/config-model/response.data';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { StudentFilter, StudentInput } from 'src/app/model/student/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient: HttpClient,
    private utilService: UtilityService) { }

    createStudent(input: StudentInput): Observable<HttpResponseData> {
      return this.httpClient.post<HttpResponseData>(
        APIUrls.StudentUrls.CreateNewStudent,input
      );
    }

    getStudentList(input:StudentFilter):Observable<HttpResponseData>{
      return this.httpClient.post<HttpResponseData>(
        APIUrls.StudentUrls.GetStudentLists,input
      );
    }
}
