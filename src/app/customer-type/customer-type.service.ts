import { Injectable } from '@angular/core';
import { CustomerType, CustomerTypeResponse } from './customer-type.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {

  customerTypeList:CustomerType[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshCustomerTypeList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<CustomerTypeResponse>(myGlobalVar.getAllCustomerType+ '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.customerTypeList = [...this.customerTypeList,...data.responseData];
          this.totalCount = this.customerTypeList[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.customerTypeList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getCustomerType(customerTypeId : number):Observable<CustomerTypeResponse>{
    

    return this.http.get<CustomerTypeResponse>(myGlobalVar.getCustomerTypeById + '?CustomerGroupId=' + customerTypeId);

  }

  deleteCustomerType(customerTypeId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteCustomerType + '?CustomerTypeId=' + customerTypeId);


   }

   AddCustomerType(customerTypeData : CustomerType):Observable<CustomerTypeResponse>{
    

    return this.http.post<CustomerTypeResponse>(myGlobalVar.AddCustomerType,customerTypeData);


   }

   updateCustomerType(customerTypeId : number,customerTypeData : CustomerType):Observable<CustomerTypeResponse>{
    
    
    return this.http.patch<CustomerTypeResponse>(myGlobalVar.UpdateCustomerType + '?CustomerGroupId=' + customerTypeId,customerTypeData);


   }



}
 