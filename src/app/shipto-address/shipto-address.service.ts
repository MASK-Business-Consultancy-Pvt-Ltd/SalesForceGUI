import { Injectable } from '@angular/core';
import { ShipToAddrs } from './shipto-address.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiptoAddressService {

  ShipToAddrsList:ShipToAddrs[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { } 

  refreshShipToAddrsList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllShipToAddrs + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
        if(data.responseData.length > 0){
          this.ShipToAddrsList = [...this.ShipToAddrsList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;
         }
      })
  }

  resetValues(){
    this.ShipToAddrsList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;
  }

  getShipToAddrs(shipToaddrsId : number):Observable<any>{
    return this.http.get<any>(myGlobalVar.getShipToAddrsById + '?ShipToAddrsId=' + shipToaddrsId);
  }

  deleteShipToAddrs(shipToaddrsId : number):Observable<any>{
    return this.http.delete<any>(myGlobalVar.DeleteShipToAddrs + '?ShipToAddrsId=' + shipToaddrsId);
   }

   AddShipToAddrs(ShipToAddrsData : any):Observable<any>{
    return this.http.post<any>(myGlobalVar.AddShipToAddrs,ShipToAddrsData);
   }

   updateShipToAddrs(shipToaddrsId : number,ShipToAddrsData : any):Observable<any>{
    return this.http.put<any>(myGlobalVar.UpdateShipToAddrs + '?ShipToAddrsId=' + shipToaddrsId,ShipToAddrsData);
   }
}
