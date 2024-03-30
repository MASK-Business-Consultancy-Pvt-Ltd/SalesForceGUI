import { Injectable } from '@angular/core';
import { CustomerType } from './customer-type.model';
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

    this.http.get<any>(myGlobalVar.getAllCustomerType+ '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.customerTypeList = [...this.customerTypeList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

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

  getCustomerType(customerTypeId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getCustomerTypeById + '?CustomerTypeId=' + customerTypeId);

  }

  deleteCustomerType(customerTypeId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteCustomerType + '?CustomerTypeId=' + customerTypeId);


   }

   AddCustomerType(customerTypeData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddCustomerType,customerTypeData);


   }

   updateCustomerType(customerTypeId : number,customerTypeData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateCustomerType + '?CustomerTypeId=' + customerTypeId,customerTypeData);


   }



}
 