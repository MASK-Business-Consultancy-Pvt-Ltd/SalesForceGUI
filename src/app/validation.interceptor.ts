import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import * as myGlobalVar from './global';


@Injectable()
export class ValidationInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(myGlobalVar.TokenKey);
    console.log(token);
    
    if (token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
    } 
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
         let errorMsg = '';
         if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
         } else {
            console.log('This is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
         }
         console.log(errorMsg);
         return throwError(()=>errorMsg);
      }),
      finalize(()=>{
        
      })
)
      
  }




}