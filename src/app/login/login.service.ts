import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as myGlobalVar from '../global';
import { Login, LoginResponse } from './login.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private http: HttpClient) { }

    public setToken(value: string) {
        localStorage.setItem(myGlobalVar.TokenKey, value);
    }

    public getToken(): string | null {
        return localStorage.getItem(myGlobalVar.TokenKey);
    }

    loginUser(data: Login): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(myGlobalVar.AuthenticateUser, data)
    }







}