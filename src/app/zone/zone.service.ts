import { HttpClient } from '@angular/common/http';
import { AddTerritory, Territory,TerritoryResponse } from './zone.model';
import { Injectable } from '@angular/core';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  zoneList:Territory[]= [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';
 
  constructor(private http: HttpClient) { }

  getZone(zoneId : number):Observable<TerritoryResponse>{
    

    return this.http.get<TerritoryResponse>(myGlobalVar.getTerritoryById + '?TerritoryId=' + zoneId);

  }

  deleteZone(zoneId : number):Observable<TerritoryResponse>{

    return this.http.delete<TerritoryResponse>(myGlobalVar.DeleteZone + '?TerritoryId=' + zoneId);


   }

   AddZone(zoneData : AddTerritory):Observable<TerritoryResponse>{
    

    return this.http.post<TerritoryResponse>(myGlobalVar.AddTerritory,zoneData);


   }

   updateZone(zoneId : number,zoneData : AddTerritory):Observable<TerritoryResponse>{
    
    
    return this.http.patch<TerritoryResponse>(myGlobalVar.UpdateTerritory + '?TerritoryId=' + zoneId,zoneData);


   }

   refreshZoneList(pageIndex:number, pageSize:number, searchTerm:string, type:string){
    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize +'&Type=' + type + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){
          this.zoneList = [...this.zoneList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;
         }
  
      })

  }

  resetValues(){

    this.zoneList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

}
 