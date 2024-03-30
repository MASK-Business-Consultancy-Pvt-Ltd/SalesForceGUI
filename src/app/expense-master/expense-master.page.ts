import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExpenseMasterService } from './expense-master.service';

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.page.html',
  styleUrls: ['./expense-master.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
       
  ],
})
export class ExpenseMasterPage implements OnInit {

  constructor(public expenseMasterService : ExpenseMasterService, private toastCtrl:ToastController) { }

  ngOnInit() {
  this.expenseMasterService.searchTerm = "";
  this.fetchExpenseMasterList(this.expenseMasterService.pageIndex, this.expenseMasterService.pageSize, this.expenseMasterService.searchTerm);
  this.expenseMasterService.pageIndex += 1;

}

public async fetchExpenseMasterList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  
  await this.expenseMasterService.refreshExpenseMasterList(pageIndex,pageSize,searchTerm);

}

public async onScrollLoadData(ev){
  
  if(this.expenseMasterService.expensemasterList.length !== this.expenseMasterService.totalCount){

     this.fetchExpenseMasterList(this.expenseMasterService.pageIndex, this.expenseMasterService.pageSize, this.expenseMasterService.searchTerm);
     this.expenseMasterService.pageIndex += 1;

  }
  
   setTimeout(() => {
    (ev as InfiniteScrollCustomEvent).target.complete();
  }, 500);

}


    // ---------------For SeachBar---------------
    toggleSearchBar() {
      this.expenseMasterService.showSearchBar = !this.expenseMasterService.showSearchBar;
    }

    public async cancelSearch() {
      this.expenseMasterService.showSearchBar = false;
      this.expenseMasterService.searchTerm = "";
      this.expenseMasterService.pageIndex = 1;
      this.expenseMasterService.expensemasterList = [];
      await this.fetchExpenseMasterList(this.expenseMasterService.pageIndex, this.expenseMasterService.pageSize, this.expenseMasterService.searchTerm);
      this.expenseMasterService.pageIndex+=1;
    }

  public async search(searchTerm){
      this.expenseMasterService.pageIndex=1;
      this.expenseMasterService.expensemasterList = [];
      await this.fetchExpenseMasterList(this.expenseMasterService.pageIndex, this.expenseMasterService.pageSize, this.expenseMasterService.searchTerm);
      this.expenseMasterService.pageIndex+=1;

    }


    async showToast(ToastMsg,colorType) {
      await this.toastCtrl.create({
        message: ToastMsg,
        duration: 2000,
        position: 'top',
        color:colorType,
        buttons: [{
          text: 'ok',
          handler: () => {
            //console.log("ok clicked");
          }
        }]
      }).then(res => res.present());
    }

    
}
