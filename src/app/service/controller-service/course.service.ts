import { catchError } from 'rxjs/operators';
import { HttpResponseData } from './../../model/config-model/response.data';
import { APIUrls } from './../../model/config-model/api-url';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from '../utility/utility.service';
import { Course } from 'src/app/model/student/course.model';
import { Student } from 'src/app/model/student/student.model';
import { SearchModel } from 'src/app/model/common/common.model';
import { Trainer } from 'src/app/model/student/trainer.model';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient,
    private utilService: UtilityService) { }

  getCourseById(courseId: string): Observable<Course> {
    let params = new HttpParams();
    params = params.append('courseId', courseId);
    return this.httpClient.get<Course>(
      APIUrls.CourseUrls.GetCourseById, { params }
    );
  }

  saveCourse(input: Course): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.CourseUrls.SaveCourse,input
    );
  }

  addStudent(courseList: Course[]): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.CourseUrls.AddStudent,courseList
    );
  }

  getTrainerList(input: SearchModel):Observable<Trainer[]>{
    return this.httpClient.post<Trainer[]>(
      APIUrls.CourseUrls.GetTrainerList,input
    );
  }

  getCourseList(input: SearchModel):Observable<Course[]>{
    return this.httpClient.post<Course[]>(
      APIUrls.CourseUrls.GetCourseList,input
    );
  }


  getTrainerById(trainerId: string): Observable<Trainer> {
    let params = new HttpParams();
    params = params.append('trainerId', trainerId);
    return this.httpClient.get<Trainer>(
      APIUrls.CourseUrls.GetTrainerById, { params }
    );
  }

  getTrainerItems():Observable<SelectItem[]>{
   return this.httpClient.get<SelectItem[]>(APIUrls.CourseUrls.GetTrainerItem)
  }

  getCourseByCid(cId: string): Observable<Course[]> {
    let params = new HttpParams();
    params = params.append('cId', cId);
    return this.httpClient.get<Course[]>(
      APIUrls.CourseUrls.GetCoursesByCid, { params }
    );
  }

  getRecommendedCourses(cid: string): Observable<Course[]> {
    let params = new HttpParams();
    params = params.append('cid', cid);
    return this.httpClient.get<Course[]>(
      APIUrls.CourseUrls.GetRecommendCourse, { params }
    );
  }
  
  
  saveTrainer(input: Trainer): Observable<HttpResponseData> {
    return this.httpClient.post<HttpResponseData>(
      APIUrls.CourseUrls.SaveTrainer,input
    );
  }

  deleteTrainerById(trainerId: string): Observable<HttpResponseData> {
    let params = new HttpParams();
    params = params.append('trainerId', trainerId);
    return this.httpClient.get<HttpResponseData>(
      APIUrls.CourseUrls.DeleteTrainer, { params }
    );
  }

  deleteCourseById(courseId: string): Observable<HttpResponseData> {
    let params = new HttpParams();
    params = params.append('courseId', courseId);
    return this.httpClient.get<HttpResponseData>(
      APIUrls.CourseUrls.DeleteCourse, { params }
    );
  }

  exportCourseDetail(courseId: number): any {
    let params = new HttpParams();
    params = params.append('courseId', courseId.toString());
    return this.httpClient
      .get(APIUrls.CourseUrls.ExportCourseDetail, {
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

  exportCourseList(inputParam: SearchModel): any {
    return this.httpClient
      .post(APIUrls.CourseUrls.ExportCourseList, inputParam, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        catchError((res: any) => {
          return this.utilService.convertBlobToText(res.error);
        })
      );
  }

  exportTrainerList(inputParam: SearchModel): any {
    return this.httpClient
      .post(APIUrls.CourseUrls.ExportTrainerList, inputParam, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        catchError((res: any) => {
          return this.utilService.convertBlobToText(res.error);
        })
      );
  }

  getCourseLevel(): Observable<SelectItem[]> {
    return this.httpClient.get<SelectItem[]>(
      APIUrls.CourseUrls.GetCourseLevel);
  }


}
