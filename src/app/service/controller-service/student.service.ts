import { SelectItem } from 'primeng/api';
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

 
  deleteStudentById(studentId: string): Observable<HttpResponseData> {
    let params = new HttpParams();
    params = params.append('studentId', studentId);
    return this.httpClient.get<HttpResponseData>(
      APIUrls.StudentUrls.DeleteStudent, { params }
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

  getStudentsByCourseId(courseId: string): Observable<Student[]> {
    let params = new HttpParams();
    params = params.append('courseId', courseId);
    return this.httpClient.get<Student[]>(
      APIUrls.StudentUrls.GetStudentsByCourseId, { params }
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

  exportStudentDetail(studentId: number): any {
    let params = new HttpParams();
    params = params.append('studentId', studentId.toString());
    return this.httpClient
      .get(APIUrls.StudentUrls.ExportStudentDetail, {
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

  getStudentStatus(): Observable<SelectItem[]> {
    return this.httpClient.get<SelectItem[]>(
      APIUrls.StudentUrls.GetStudentStatus);
  }
}
