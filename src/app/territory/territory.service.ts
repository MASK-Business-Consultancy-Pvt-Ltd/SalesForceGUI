import { Injectable } from '@angular/core';
import { Territory } from './territory.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {

  territoryList:Territory[]= [];
  areaList:Territory[]= [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }


  refreshTerritoryList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllTerritory + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.territoryList = [...this.territoryList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.territoryList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getAreaList(){

    this.http.get<any>(myGlobalVar.getAllAreaWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.areaList = data.responseData;
          }
  
      })

  }

  getTerritory(territoryId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getTerritoryById + '?TerritoryId=' + territoryId);

  }

  deleteTerritory(territoryId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteTerritory + '?TerritoryId=' + territoryId);


   }

   AddTerritory(territoryData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddTerritory,territoryData);


   }

   updateTerritory(territoryId : number,territoryData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateTerritory + '?TerritoryId=' + territoryId,territoryData);


   }




}
 