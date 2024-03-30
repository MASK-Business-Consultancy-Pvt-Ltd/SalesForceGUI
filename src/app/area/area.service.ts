import { Injectable } from '@angular/core';
import { Area } from './area.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Region } from '../region/region.model';
import { CustomerType } from '../customer-type/customer-type.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  areaList:Area[]= [];
  regionList:Region[]= [];
  customerTypeList: CustomerType[]=[];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }
  

  refreshAreaList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllArea + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.areaList = [...this.areaList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.areaList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getRegionList(){

    this.http.get<any>(myGlobalVar.getAllRegionWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{

          if(data.responseData)
          {             
              this.regionList = data.responseData;
          }
  
      })
  }

  getArea(areaId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getAreaById + '?AreaId=' + areaId);

  }

  deleteArea(areaId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteArea + '?AreaId=' + areaId);


   }

   AddArea(areaData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddArea,areaData);


   }

   updateArea(areaId : number,areaData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateArea + '?AreaId=' + areaId,areaData);


   }
  
}
 