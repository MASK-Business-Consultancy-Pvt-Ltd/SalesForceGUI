import { Injectable } from '@angular/core';
import * as myGlobalVar from '../global';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Territory, TerritoryResponse } from '../zone/zone.model';

@Injectable({
  providedIn: 'root'
})
export class TerritoryService {

  territoryList: Territory[] = [];
  areaList: Territory[] = [];
  public totalCount = 0;
  public pageIndex = 1;
  public pageSize = 10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }


  refreshTerritoryList(pageIndex: number, pageSize: number, searchTerm: string) {

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&Type=' + myGlobalVar.TypeCodeTerritory + '&SearchTerm=' + searchTerm).pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.territoryList = [...this.territoryList, ...data.responseData];
        this.totalCount = data.responseData[0].totalCount;

      }

    })

  }

  resetValues() {

    this.territoryList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getAreaList() {

    this.http.get<TerritoryResponse>(myGlobalVar.getAllTerritory + '?pageIndex=1&pageSize=1000&Type=' + myGlobalVar.TypeCodeArea + '&SearchTerm=').pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {

      if (data.responseData.length > 0) {

        this.areaList = data.responseData
      }

    })

  }

  getTerritory(territoryId: number): Observable<TerritoryResponse> {
    return this.http.get<TerritoryResponse>(myGlobalVar.getTerritoryById + '?TerritoryId=' + territoryId);
  }

  deleteTerritory(territoryId: number): Observable<TerritoryResponse> {
    return this.http.delete<TerritoryResponse>(myGlobalVar.DeleteTerritory + '?TerritoryId=' + territoryId);
  }

  AddTerritory(territoryData: Territory): Observable<TerritoryResponse> {
    return this.http.post<TerritoryResponse>(myGlobalVar.AddTerritory, territoryData);
  }

  updateTerritory(territoryId: number, territoryData: Territory): Observable<TerritoryResponse> {
    return this.http.patch<TerritoryResponse>(myGlobalVar.UpdateTerritory + '?TerritoryId=' + territoryId, territoryData);
  }




}
