import { Injectable } from '@angular/core';
import { AddTerritory, Territory, TerritoryResponse } from '../zone/zone.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  regionList:Territory[]= [];

  zoneList:Territory[]=[];

  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshRegionList(pageIndex:number, pageSize:number, searchTerm:string,type:string){

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize +'&Type=' + type + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.regionList = [...this.regionList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  getZoneList(){

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=1&pageSize=10000&Type=' + myGlobalVar.TypeCodeZone + '&SearchTerm=').pipe(catchError(error=>{
        
      return throwError(()=>error);

    })).subscribe(data=>{

      if(data.responseData.length > 0){

        this.zoneList = data.responseData;

       }

    })

  }

  resetValues(){

    this.regionList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;

  }

  getRegion(regionId : number):Observable<TerritoryResponse>{
    

    return this.http.get<TerritoryResponse>(myGlobalVar.getTerritoryById + '?TerritoryId=' + regionId);

  }

  deleteRegion(regionId : number):Observable<TerritoryResponse>{

    return this.http.delete<TerritoryResponse>(myGlobalVar.DeleteRegion + '?TerritoryId=' + regionId);


   }
   
   AddRegion(regionData : AddTerritory):Observable<TerritoryResponse>{
    

    return this.http.post<TerritoryResponse>(myGlobalVar.AddTerritory,regionData);


   }

   updateRegion(regionId : number,regionData : AddTerritory):Observable<TerritoryResponse>{
    
    
    return this.http.patch<TerritoryResponse>(myGlobalVar.UpdateTerritory + '?TerritoryId=' + regionId,regionData);


   }

}
 