import { CommonUrls } from './../../model/config-model/common-url';
import { catchError } from 'rxjs/operators';
import { HttpResponseData } from './../../model/config-model/response.data';
import { APIUrls } from './../../model/config-model/api-url';
import { SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/service/utility/utility.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropDownItem } from 'src/app/model/common/common.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient,
    private utilService: UtilityService) { }

  getDropDownItem(name: string): Observable<SelectItem[]> {
    let params = new HttpParams();
    params = params.append('name', name);
    return this.httpClient.get<SelectItem[]>(
      APIUrls.CommonUrls.GetDropDownItem, { params }
    );
  }

  saveDropDownItem(dropDownList: DropDownItem[]):Observable<HttpResponseData>{
    return this.httpClient.post<HttpResponseData>(
      APIUrls.CommonUrls.SaveDropDown, dropDownList
    );
  }
  
  deleteDropDown(name: string): Observable<HttpResponseData> {
    let params = new HttpParams();
    params = params.append('name', name);
    return this.httpClient.get<HttpResponseData>(
      APIUrls.CommonUrls.DeleteDropDown, { params }
    );
  }

  getDropDownName(): Observable<SelectItem[]> {
    return this.httpClient.get<SelectItem[]>(
      APIUrls.CommonUrls.GetDropDownName);
  }



  downloadSimpleUploadFile(name: string): any {
    let params = new HttpParams();
    params = params.append('name', name);
    return this.httpClient
      .get(APIUrls.CommonUrls.DownloadSimpleUpload, {
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
