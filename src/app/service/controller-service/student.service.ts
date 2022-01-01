import { catchError } from 'rxjs/operators';
import { UtilityService } from './../utility/utility.service';
import { APIUrls } from 'src/app/model/config-model/api-url';
import { HttpResponseData } from './../../model/config-model/response.data';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from 'src/app/model/student/student.model';
import { SearchModel } from 'src/app/model/common/common.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient: HttpClient,
    private utilService: UtilityService) { }

  saveStudent(input: Student): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.StudentUrls.SaveStudent, input
    );
  }

  getStudentList(input: SearchModel): Observable<Student[]> {
    return this.httpClient.post<Student[]>(
      APIUrls.StudentUrls.GetStudentList, input
    );
  }

  getStudentById(studentId: string): Observable<Student> {
    let params = new HttpParams();
    params = params.append('studentId', studentId);
    return this.httpClient.get<Student>(
      APIUrls.StudentUrls.GetStudentById, { params }
    );
  }


  exportStudentList(inputParam: SearchModel): any {
    return this.httpClient
      .post(APIUrls.StudentUrls.ExportStudentList, inputParam, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        catchError((res: any) => {
          return this.utilService.convertBlobToText(res.error);
        })
      );
  }
}
