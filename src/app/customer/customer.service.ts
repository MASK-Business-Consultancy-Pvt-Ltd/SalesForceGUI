import { Injectable } from '@angular/core';
import { Customer } from './customer.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { CustomerType } from '../customer-type/customer-type.model';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Territory } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customerList: Customer[] = [];
  customerTypeList: CustomerType[]=[];
  territoryList: Territory[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshCustomerList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllCustomer + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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

    this.http.get<any>(myGlobalVar.getAllCustomerTypeWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.customerTypeList = data.responseData;
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

  getCustomer(customerId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getCustomerById + '?CustomerId=' + customerId);

  }

  deleteCustomer(customerId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteCustomer + '?CustomerId=' + customerId);

   }


   AddCustomer(customerData : any):Observable<any>{
    
    return this.http.post<any>(myGlobalVar.AddCustomer,customerData);

   }

   updateCustomer(customerId : number,customerData : any):Observable<any>{
       
    return this.http.put<any>(myGlobalVar.UpdateCustomer+ '?CustomerId=' + customerId,customerData);

   }


}
 