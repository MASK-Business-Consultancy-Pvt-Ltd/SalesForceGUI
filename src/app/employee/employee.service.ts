import { Injectable } from '@angular/core';
import { Employee, EmployeeResponse, GeoResource, GeoResourceResponse, addEmployee } from './employee.model';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EmployeeLevel, EmployeeLevelResponse } from '../level/level.model';
import { Territory, TerritoryResponse } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeList: Employee[] = [];
  fullEmployeeList: Employee[]=[]
  levelList: EmployeeLevel[] = [];
  stateList: GeoResource[] = [];
  countryList: GeoResource[] = [];
  territoryList:Territory[]=[]
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

    this.http.get<any>(myGlobalVar.getAllEmployee + '?pageIndex=1&pageSize=10000&SearchTerm=').pipe(catchError(error=>{
        
      return throwError(()=>error);

    })).subscribe(data=>{

      if(data.responseData.length > 0){

        this.fullEmployeeList = data.responseData

       }

    })

  }


  getLevelList(){

    this.http.get<EmployeeLevelResponse>(myGlobalVar.getAllLevel + '?pageIndex=1&pageSize=1000&SearchTerm=').pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.levelList = data.responseData

      }

    })

  }

  getStateList(){

    this.http.get<GeoResourceResponse>(myGlobalVar.getStateList).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.stateList = data.responseData;
          }
  
      })

  }

  getCountryList(){

    this.http.get<GeoResourceResponse>(myGlobalVar.getCountryList).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {
             
              this.countryList = data.responseData;
          }
  
      })

  }


  getTerritoryList(){

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=1&pageSize=1000&Type=' + myGlobalVar.TypeCodeTerritory + '&SearchTerm=').pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.territoryList = data.responseData

      }

    })

  }


  getEmployee(employeeId : string):Observable<EmployeeResponse>{
    

    return this.http.get<EmployeeResponse>(myGlobalVar.getEmployeeById + '?EmpId=' + employeeId);

  }

  deleteEmployee(employeeId : number):Observable<EmployeeResponse>{

    return this.http.delete<EmployeeResponse>(myGlobalVar.DeleteEmployee + '?EmployeeId=' + employeeId);

   }


   AddEmployee(employeeData : addEmployee):Observable<EmployeeResponse>{
    
    return this.http.post<EmployeeResponse>(myGlobalVar.AddEmployee,employeeData);

   }

   updateEmployee(EmployeeCode : string,employeeData : addEmployee):Observable<EmployeeResponse>{
       
    return this.http.patch<EmployeeResponse>(myGlobalVar.UpdateEmployee+ '?EmployeeCode=' + EmployeeCode,employeeData);

   }


}
