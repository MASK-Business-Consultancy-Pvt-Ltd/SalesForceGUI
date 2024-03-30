import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public showMenu: boolean;

  constructor() 
  { 
    this.showMenu = false;
  }


    getMenuState(){

       if(localStorage.getItem('UserId')){

          this.showMenu = true;

       }else{

          this.showMenu = false;

       }

       return this.showMenu;
    }

}
