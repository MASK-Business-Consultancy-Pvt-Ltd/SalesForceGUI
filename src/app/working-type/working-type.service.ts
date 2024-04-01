import { Injectable } from '@angular/core';
import { WorkingType, WorkingTypeResponse } from './working-type.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkingTypeService {

  workingTypeList:WorkingType[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { } 

  refreshworkingTypeList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllWorkingType + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.workingTypeList = [...this.workingTypeList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.workingTypeList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getWorkingType(workingTypeId : string):Observable<WorkingTypeResponse>{
    return this.http.get<WorkingTypeResponse>(myGlobalVar.getWorkingTypeById + '?WorkingTypeId=' + workingTypeId);
  }

  deleteWorkingType(workingTypeId : string):Observable<WorkingTypeResponse>{
    return this.http.delete<WorkingTypeResponse>(myGlobalVar.DeleteWorkingType + '?WorkingTypeId=' + workingTypeId);
   }

   AddWorkingType(prodTypeData : WorkingType):Observable<WorkingTypeResponse>{
    return this.http.post<WorkingTypeResponse>(myGlobalVar.AddWorkingType,prodTypeData);
   }

   updateWorkingType(workingTypeId : string,prodTypeData : WorkingType):Observable<WorkingTypeResponse>{
    return this.http.patch<WorkingTypeResponse>(myGlobalVar.UpdateWorkingType + '?WorkingTypeId=' + workingTypeId,prodTypeData);
   }


}
