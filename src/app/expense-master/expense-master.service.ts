import { Injectable } from '@angular/core';
import { ExpenseMaster, ExpenseResponse } from './expense-master.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EmployeeLevel, EmployeeLevelResponse } from '../level/level.model';

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
  levelList:EmployeeLevel[]=[]

  constructor(private http: HttpClient) { }

  refreshExpenseMasterList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<ExpenseResponse>(myGlobalVar.getAllExpenseMaster+ '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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

  getExpenseMaster(expenseMasterId : string):Observable<ExpenseResponse>{
    

    return this.http.get<ExpenseResponse>(myGlobalVar.getExpenseMasterById + '?ExpenseMasterId=' + expenseMasterId);

  }

  deleteExpenseMaster(expenseMasterId : number):Observable<ExpenseResponse>{

    return this.http.delete<ExpenseResponse>(myGlobalVar.DeleteExpenseMaster + '?ExpenseMasterId=' + expenseMasterId);


   }

   AddExpenseMaster(expenseMasterData : ExpenseMaster):Observable<ExpenseResponse>{
    

    return this.http.post<ExpenseResponse>(myGlobalVar.AddExpenseMaster,expenseMasterData);


   }

   updateExpenseMaster(expenseMasterId : string,expenseMasterData : ExpenseMaster):Observable<ExpenseResponse>{
    
    
    return this.http.patch<ExpenseResponse>(myGlobalVar.UpdateExpenseMaster + '?ExpenseMasterId=' + expenseMasterId,expenseMasterData);


   }

   getEmployeeLevel() {

    this.http.get<EmployeeLevelResponse>(myGlobalVar.getAllLevel + '?pageIndex=1&pageSize=1000&SearchTerm=').pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.levelList = data.responseData

      }

    })

  }



}
 