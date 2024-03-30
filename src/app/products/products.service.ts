import { Injectable } from '@angular/core';
import { Product } from './products.model';
import { HttpClient } from '@angular/common/http'; 
import * as myGlobalVar from '../global';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductType } from '../product-type/product-type.model';

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
        debugger;
    this.http.get<any>(myGlobalVar.getAllProducts + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&SearchTerm=' + searchTerm).pipe(catchError(error=>{
        
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
    debugger;
    this.http.get<any>(myGlobalVar.getAllProductTypeWithoutPagination).pipe(catchError(error=>{
        
        return throwError(()=>error); 
  
      })).subscribe(data=>{
  
          if(data.responseData)
          {         
              this.productTypeList = data.responseData;
          }
  
      })

  }

  getProduct(productId : number):Observable<any>{
    

    return this.http.get<any>(myGlobalVar.getProductById + '?ProductId=' + productId);

  }

   deleteProduct(productId : number):Observable<any>{

    return this.http.delete<any>(myGlobalVar.DeleteProduct + '?ProductId=' + productId);


   }

   AddProduct(prodData : any):Observable<any>{
    

    return this.http.post<any>(myGlobalVar.AddProduct,prodData);


   }

  updateProduct(productId : number,prodData : any):Observable<any>{
    
    
    return this.http.put<any>(myGlobalVar.UpdateProduct + '?ProductId=' + productId,prodData);


   }


}
