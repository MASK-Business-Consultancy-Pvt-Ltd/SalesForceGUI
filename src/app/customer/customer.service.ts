import { Injectable } from '@angular/core';
import { BusinessResponseData, CardInfo } from './customer.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { CustomerType, CustomerTypeResponse } from '../customer-type/customer-type.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Territory } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerList: CardInfo[] = [];
  customerTypeList: CustomerType[]=[];
  territoryList: Territory[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshCustomerList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<BusinessResponseData>(myGlobalVar.getAllCustomer + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.customerList = [...this.customerList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.customerList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;

  }

  getCustomerTypeList(){

    this.http.get<CustomerTypeResponse>(myGlobalVar.getAllCustomerType+ '?pageIndex=1&pageSize=1000&SearchTerm=').pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.customerTypeList = data.responseData;
          }
  
      })

  }


  getTerritoryList(){

    this.http.get<any>(myGlobalVar.getAllTerritory+ '?pageIndex=1&pageSize=1000&Type='+ myGlobalVar.TypeCodeTerritory).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
          if(data.responseData)
          {
             
              this.territoryList = data.responseData;
          }
  
      })

  }

  getCustomer(customerId : string):Observable<BusinessResponseData>{
    

    return this.http.get<BusinessResponseData>(myGlobalVar.getCustomerById + '?BPID=' + customerId);

  }

  deleteCustomer(customerId : number):Observable<BusinessResponseData>{

    return this.http.delete<BusinessResponseData>(myGlobalVar.DeleteCustomer + '?CustomerId=' + customerId);

   }


   AddCustomer(customerData : CardInfo):Observable<BusinessResponseData>{
    
    return this.http.post<BusinessResponseData>(myGlobalVar.AddCustomer,customerData);

   }

   updateCustomer(customerId : string,customerData : CardInfo):Observable<BusinessResponseData>{
       
    return this.http.put<any>(myGlobalVar.UpdateCustomer+ '?CustomerId=' + customerId,customerData);

   }


}
 