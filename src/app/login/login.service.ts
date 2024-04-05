import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as myGlobalVar from '../global';
import { Login, LoginResponse } from './login.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private http: HttpClient, private router:Router,private toastCtrl: ToastController) { }

    public setToken(value: string) {
        localStorage.setItem(myGlobalVar.TokenKey, value);
    }

    public getToken(): string | null {
        return localStorage.getItem(myGlobalVar.TokenKey);
    }

    public Logout(){
        localStorage.clear();
        this.router.navigate(['/'])
        this.showToast('Session expired,Please Login again!','danger')
    }

    loginUser(data: Login): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(myGlobalVar.AuthenticateUser, data)
    }



    async showToast(ToastMsg, colorType) {
        await this.toastCtrl.create({
          message: ToastMsg,
          duration: 2000,
          position: 'top',
          color: colorType,
          buttons: [{
            text: 'ok',
            handler: () => {
              //console.log("ok clicked");
            }
          }]
        }).then(res => res.present());
      }



}