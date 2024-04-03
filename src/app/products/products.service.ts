import { Injectable } from '@angular/core';
import { Product, ProductResponse } from './products.model';
import { HttpClient } from '@angular/common/http'; 
import * as myGlobalVar from '../global';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductType, productTypeResponse } from '../product-type/product-type.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productList:Product[] = [];

  productTypeList:ProductType[] = [];

  public totalCount=0;
  public pageIndex=1;
  public pageSize=10;
  showSearchBar = false;
  searchTerm: string = '';
  
  constructor(private http: HttpClient) { }

  refreshProductList(pageIndex:number, pageSize:number, searchTerm:string){
    this.http.get<ProductResponse>(myGlobalVar.getAllProducts + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
        return throwError(()=>error);
  
      })).subscribe(data=>{
  
        if(data.responseData.length > 0){

          this.productList = [...this.productList,...data.responseData];
          this.totalCount = data.responseData[0].totalCount;

         }
  
      })

  }

  resetValues(){

    this.productList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchTerm = '';
    this.totalCount = 0;
    this.showSearchBar = false;


  }

  getProductTypeList(){
    this.http.get<productTypeResponse>(myGlobalVar.getAllProductType + '?pageIndex=1&pageSize=1000&SearchTerm=').pipe(catchError(error => {

      return throwError(() => error);

    })).subscribe(data => {
      console.log(data);

      if (data.responseData.length > 0) {

        this.productTypeList = data.responseData;

      }

    })

  }

  getProduct(productId : string):Observable<ProductResponse>{
    

    return this.http.get<ProductResponse>(myGlobalVar.getProductById + '?ProductId=' + productId);

  }

   deleteProduct(productId : number):Observable<ProductResponse>{

    return this.http.delete<ProductResponse>(myGlobalVar.DeleteProduct + '?ProductId=' + productId);


   }

   AddProduct(prodData : Product):Observable<ProductResponse>{
    

    return this.http.post<ProductResponse>(myGlobalVar.AddProduct,prodData);


   }

  updateProduct(productId : string,prodData : Product):Observable<ProductResponse>{
    return this.http.patch<ProductResponse>(myGlobalVar.UpdateProduct + '?ProductId=' + productId,prodData);
   }


}
