import { Injectable } from '@angular/core';
import { ExpenseHead } from './expense-head.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseHeadService {

  expenseHeadList:ExpenseHead[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { } 

  refreshexpenseheadList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllExpenseHead + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.expenseHeadList = [...this.expenseHeadList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
      })
  }

  resetValues(){

    this.expenseHeadList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getExpenseHead(expenseheadId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getExpenseHeadById + '?ExpenseHeadId=' + expenseheadId);

  }

  deleteExpenseHead(expenseheadId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteExpenseHead + '?ExpenseHeadId=' + expenseheadId);


   }

   AddExpenseHead(ExpnHeadData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddExpenseHead,ExpnHeadData);


   }

   updateExpenseHead(expenseheadId : number,ExpnHeadData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateExpenseHead + '?ExpenseHeadId=' + expenseheadId,ExpnHeadData);


   }


}
