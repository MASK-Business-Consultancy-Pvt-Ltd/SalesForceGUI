import { Injectable } from '@angular/core';
import { Region } from './region.model';
import { Zone } from '../zone/zone.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  regionList:Region[]= [];

  zoneList:Zone[]=[];

  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshRegionList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllRegion + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.regionList = [...this.regionList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  getZoneList(){
   debugger;
    this.http.get<any>(myGlobalVar.getAllZoneWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error); 
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.zoneList = data.responseData;
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

  getRegion(regionId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getRegionById + '?RegionId=' + regionId);

  }

  deleteRegion(regionId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteRegion + '?RegionId=' + regionId);


   }
   
   AddRegion(regionData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddRegion,regionData);


   }

   updateRegion(regionId : number,regionData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateRegion + '?RegionId=' + regionId,regionData);


   }

}
 