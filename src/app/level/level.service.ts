import { Injectable } from '@angular/core';
import { Level } from './level.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  levelList:Level[]= [];
  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  refreshLevelList(pageIndex:number, pageSize:number, searchTerm:string){

    this.http.get<any>(myGlobalVar.getAllLevel + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.levelList = [...this.levelList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.levelList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getLevel(levelId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getLevelById + '?LevelId=' + levelId);

  }

  deleteLevel(levelId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteLevel + '?LevelId=' + levelId);


   }

   AddLevel(levelData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddLevel,levelData);


   }

   updateLevel(levelId : number,levelData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateLevel + '?LevelId=' + levelId,levelData);


   }


}
 