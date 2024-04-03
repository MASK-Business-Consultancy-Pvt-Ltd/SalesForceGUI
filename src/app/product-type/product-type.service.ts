import { Injectable } from '@angular/core';
import { ProductType, productTypeResponse } from './product-type.model';
import { HttpClient } from '@angular/common/http';
import * as myGlobalVar from '../global';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  productTypeList: ProductType[] = [];
  public totalCount = 0;
  public pageIndex = 1;
  public pageSize = 10;
  showSearchBar = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) { }

  // refreshProductTypeList(pageIndex:number, pageSize:number, searchTerm:string){
  //   debugger;
  //   this.http.get<any>(myGlobalVar.getAllProductType + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{  
  //       return throwError(()=>error);

  //     })).subscribe(data=>{
  //         console.log(data);
  //       //this.productTypeList=data
  //       if(data> 0){  
  //         console.log(data);            
  //         this.productTypeList =[...this.productTypeList,...data.responseData];

  //         this.totalCount = data.responseData[0].totalCount;
  //        }
  //     })
  // }


  refreshProductType(pageIndex: number, pageSize: number, searchTerm: string) {
    debugger;
    this.http.get<productTypeResponse>(myGlobalVar.getAllProductType + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {
      console.log(data);

      if (data.responseData.length > 0) {

        this.productTypeList = [...this.productTypeList, ...data.responseData];

      }

    })

  }


  resetValues() {
    this.productTypeList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;
  }

  getProductType(productTypeId: number): Observable<productTypeResponse> {
    debugger;
    return this.http.get<productTypeResponse>(myGlobalVar.getProductTypeById + '?ProductTypeId=' + productTypeId);

  }

  deleteProductType(productTypeId: number): Observable<any> {

    return this.http.delete<any>(myGlobalVar.DeleteProductType + '?ProductTypeId=' + productTypeId);

  }

  AddProductType(prodTypeData: { groupName: string }): Observable<productTypeResponse> {

    return this.http.post<productTypeResponse>(myGlobalVar.AddProductType, prodTypeData);

  }

  updateProductType(productTypeId: number, prodTypeData: any): Observable<productTypeResponse> {


    return this.http.patch<productTypeResponse>(myGlobalVar.UpdateProductType + '?ProductTypeId=' + productTypeId, prodTypeData);


  }


}
