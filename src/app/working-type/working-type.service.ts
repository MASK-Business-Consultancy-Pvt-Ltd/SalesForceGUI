import { Injectable } from '@angular/core';
import { WorkingType } from './working-type.model';
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

    this.http.get<any>(myGlobalVar.getAllProductType + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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

  getWorkingType(workingTypeId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getProductTypeById + '?WorkingTypeId=' + workingTypeId);

  }

  deleteWorkingType(workingTypeId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteProductType + '?WorkingTypeId=' + workingTypeId);


   }

   AddWorkingType(prodTypeData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddProductType,prodTypeData);


   }

   updateWorkingType(workingTypeId : number,prodTypeData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateProductType + '?WorkingTypeId=' + workingTypeId,prodTypeData);


   }


}
