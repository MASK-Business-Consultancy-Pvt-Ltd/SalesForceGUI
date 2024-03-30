import { Injectable } from '@angular/core';
import { DailyActivity } from './daily-activity.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ProductType } from '../product-type/product-type.model';
import { Territory } from './../territory/territory.model';
import { WorkingType } from '../working-type/working-type.model';

@Injectable({
  providedIn: 'root'
})
export class DailyActivityService {

  dailyActivityList:DailyActivity[] = [];
  ProductTypeList:ProductType[] = [];
  TerritoryList:Territory[] = [];
  WorkingTypeList:WorkingType[]=[];

  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { } 

  refreshDailyActivityList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllDailyActivity + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.dailyActivityList = [...this.dailyActivityList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.dailyActivityList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getDailyActivity(dailyactivityId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getDailyActivityById + '?DailyActivityId=' + dailyactivityId);

  }

  deleteDailyActivity(dailyactivityId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteDailyActivity + '?DailyActivityId=' + dailyactivityId);


   }

   AddDailyActivity(dailyactivityData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddDailyActivity,dailyactivityData);


   }

   updateDailyActivity(dailyactivityId : number,dailyActivityData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateDailyActivity + '?DailyActivityId=' + dailyactivityId,dailyActivityData);

   }

   getProductTypeList(){
    this.http.get<any>(myGlobalVar.getAllProductTypeWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error); 
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {         
              this.ProductTypeList = data.responseData;
          }
  
      })

  }


  getTerritoryList(){

    this.http.get<any>(myGlobalVar.getAllTerritoryWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.TerritoryList = data.responseData;
          }
  
      })

  }


  getWorkingTypeList(){

    this.http.get<any>(myGlobalVar.getAllWorkingTypeWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.WorkingTypeList = data.responseData;
          }
  
      })

  }


}
