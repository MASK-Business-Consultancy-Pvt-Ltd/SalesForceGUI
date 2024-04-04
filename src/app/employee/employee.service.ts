import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EmployeeLevel } from '../level/level.model';
import { Territory } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeList: Employee[] = [];
  levelList: EmployeeLevel[] = [];
  territoryList: Territory[] = [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshEmployeeList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllEmployee + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.employeeList = [...this.employeeList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.employeeList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getEmployeeList(){

    this.http.get<any>(myGlobalVar.getAllEmployeeWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.employeeList = data.responseData;
          }
  
      })

  }


  getLevelList(){

    this.http.get<any>(myGlobalVar.getAllLevelWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.levelList = data.responseData;
          }
  
      })

  }

  getTerritoryList(){

    this.http.get<any>(myGlobalVar.getAllTerritoryWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.territoryList = data.responseData;
          }
  
      })

  }


  getEmployee(employeeId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getEmployeeById + '?EmployeeId=' + employeeId);

  }

  deleteEmployee(employeeId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteEmployee + '?EmployeeId=' + employeeId);

   }


   AddEmployee(employeeData : any):Observable<any>{
    
    return this.http.post<any>(myGlobalVar.AddEmployee,employeeData);

   }

   updateEmployee(employeeId : number,employeeData : any):Observable<any>{
       
    return this.http.put<any>(myGlobalVar.UpdateEmployee+ '?EmployeeId=' + employeeId,employeeData);

   }


}
