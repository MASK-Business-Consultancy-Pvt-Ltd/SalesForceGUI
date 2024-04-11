import { Injectable } from '@angular/core';
import { BillToAddrs } from './billto-address.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { CustomerType } from '../customer-type/customer-type.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Territory } from '../zone/zone.model';
import { AddressInfo } from '../customer/customer.model';

@Injectable({
  providedIn: 'root'
})
export class BillToAddrsService {
  availableAddressList: AddressInfo[] = []
  billToAddrsList: BillToAddrs[] = [];
  territoryList: Territory[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshBillToAddrsList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllBillToAddrs + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.billToAddrsList = [...this.billToAddrsList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){
    this.billToAddrsList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;

  }

  getBillToAddrsList(){

    this.http.get<any>(myGlobalVar.getAllBillToAddrsWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.billToAddrsList = data.responseData;
          }
  
      })

  }


  getTerritoryList(){

    this.http.get<any>(myGlobalVar.getAllTerritoryWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
          debugger
          if(data.responseData)
          {
             
              this.territoryList = data.responseData;
          }
  
      })

  }

  getBillToAddrs(customerId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getBillToAddrsById + '?CustomerId=' + customerId);

  }

  deleteBillToAddrs(customerId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteBillToAddrs + '?CustomerId=' + customerId);

   }


   AddBillToAddrs(customerData : any):Observable<any>{
    
    return this.http.post<any>(myGlobalVar.AddBillToAddrs,customerData);

   }

   updateBillToAddrs(customerId : number,customerData : any):Observable<any>{
       
    return this.http.put<any>(myGlobalVar.UpdateBillToAddrs+ '?CustomerId=' + customerId,customerData);

   }


}
 