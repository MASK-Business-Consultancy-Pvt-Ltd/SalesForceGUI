import { Injectable } from '@angular/core';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CustomerType } from '../customer-type/customer-type.model';
import { Territory, TerritoryResponse } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  areaList:Territory[]= [];
  regionList:Territory[]= [];
  customerTypeList: CustomerType[]=[];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }
  

  refreshAreaList(pageIndex:number, pageSize:number, searchTerm:string,type:string){

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&Type=' + type + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=1&pageSize=10000&Type=' + myGlobalVar.TypeCodeRegion + '&SearchTerm=').pipe(catchError(error=>{
        
      return throwError(()=>error);

    })).subscribe(data=>{

      if(data.responseData.length > 0){

        this.regionList = data.responseData;

       }

    })

  }

  getArea(areaId : number):Observable<TerritoryResponse>{
    

    return this.http.get<TerritoryResponse>(myGlobalVar.getTerritoryById + '?TerritoryId=' + areaId);

  }

  deleteArea(areaId : number):Observable<TerritoryResponse>{

    return this.http.delete<TerritoryResponse>(myGlobalVar.DeleteArea + '?TerritoryId=' + areaId);


   }

   AddArea(areaData : Territory):Observable<TerritoryResponse>{
    

    return this.http.post<TerritoryResponse>(myGlobalVar.AddTerritory,areaData);


   }

   updateArea(areaId : number,areaData : Territory):Observable<TerritoryResponse>{
    
    
    return this.http.patch<TerritoryResponse>(myGlobalVar.UpdateTerritory + '?TerritoryId=' + areaId,areaData);


   }
  
}
 