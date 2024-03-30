import { HttpClient } from '@angular/common/http';
import { Zone } from './zone.model';
import { Injectable } from '@angular/core';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  zoneList:Zone[]= [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';
 
  constructor(private http: HttpClient) { }

  getZone(zoneId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getZoneById + '?ZoneId=' + zoneId);

  }

  deleteZone(zoneId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteZone + '?ZoneId=' + zoneId);


   }

   AddZone(zoneData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddZone,zoneData);


   }

   updateZone(zoneId : number,zoneData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateZone + '?ZoneId=' + zoneId,zoneData);


   }

   refreshZoneList(pageIndex:number, pageSize:number, searchTerm:string){
    debugger
    this.http.get<any>(myGlobalVar.getAllZone + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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
 