import { Injectable } from '@angular/core';
import { EmployeeLevel, EmployeeLevelResponse } from './level.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  employeelevelList: EmployeeLevel[] = [];
  public totalCount = 0;
  public pageIndex = 1;
  public pageSize = 10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshLevelList(pageIndex: number, pageSize: number, searchTerm: string) {

    this.http.get<EmployeeLevelResponse>(myGlobalVar.getAllLevel + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.employeelevelList = [...this.employeelevelList, ...data.responseData];
        this.totalCount = data.responseData[0].totalCount;

      }

    })

  }

  resetValues() {

    this.employeelevelList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getLevel(levelId: number): Observable<EmployeeLevelResponse> {
    return this.http.get<EmployeeLevelResponse>(myGlobalVar.getLevelById + '?EmployeeLevelId=' + levelId);
  }

  deleteLevel(levelId: number): Observable<EmployeeLevelResponse> {
    return this.http.delete<EmployeeLevelResponse>(myGlobalVar.DeleteLevel + '?EmployeeLevelId=' + levelId);
  }

  AddLevel(levelData: any): Observable<EmployeeLevelResponse> {
    return this.http.post<EmployeeLevelResponse>(myGlobalVar.AddLevel, levelData);
  }

  updateLevel(levelId: number, levelData: any): Observable<EmployeeLevelResponse> {
    return this.http.patch<EmployeeLevelResponse>(myGlobalVar.UpdateLevel + '?EmployeeLevelId=' + levelId, levelData);
  }


}
