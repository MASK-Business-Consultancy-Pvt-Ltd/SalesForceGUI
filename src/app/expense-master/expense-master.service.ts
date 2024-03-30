import { Injectable } from '@angular/core';
import { ExpenseMaster } from './expense-master.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseMasterService {

  expensemasterList:ExpenseMaster[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshExpenseMasterList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllExpenseMaster+ '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.expensemasterList = [...this.expensemasterList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.expensemasterList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getExpenseMaster(expenseMasterId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getExpenseMasterById + '?ExpenseMasterId=' + expenseMasterId);

  }

  deleteExpenseMaster(expenseMasterId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteExpenseMaster + '?ExpenseMasterId=' + expenseMasterId);


   }

   AddExpenseMaster(expenseMasterData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddExpenseMaster,expenseMasterData);


   }

   updateExpenseMaster(expenseMasterId : number,expenseMasterData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateExpenseMaster + '?ExpenseMasterId=' + expenseMasterId,expenseMasterData);


   }



}
 