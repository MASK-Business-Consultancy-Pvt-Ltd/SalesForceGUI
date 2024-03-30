import { ExpenseHeadService } from './expense-head.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-expense-head',
  templateUrl: './expense-head.page.html',
  styleUrls: ['./expense-head.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule],
})
export class ExpenseHeadPage implements OnInit {

  constructor(public expenseHeadService : ExpenseHeadService, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.expenseHeadService.searchTerm = "";
    this.fetchexpenseHeadList(this.expenseHeadService.pageIndex, this.expenseHeadService.pageSize, this.expenseHeadService.searchTerm);
    this.expenseHeadService.pageIndex += 1;
  }

  public async fetchexpenseHeadList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.expenseHeadService.refreshexpenseheadList(pageIndex,pageSize,searchTerm);

  }


  public async onScrollLoadData(ev){
    
    if(this.expenseHeadService.expenseHeadList.length !== this.expenseHeadService.totalCount){

       this.fetchexpenseHeadList(this.expenseHeadService.pageIndex, this.expenseHeadService.pageSize, this.expenseHeadService.searchTerm);
       this.expenseHeadService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.expenseHeadService.showSearchBar = !this.expenseHeadService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.expenseHeadService.showSearchBar = false;
        this.expenseHeadService.searchTerm = "";
        this.expenseHeadService.pageIndex = 1;
        this.expenseHeadService.expenseHeadList = [];
        await this.fetchexpenseHeadList(this.expenseHeadService.pageIndex, this.expenseHeadService.pageSize, this.expenseHeadService.searchTerm);
        this.expenseHeadService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.expenseHeadService.pageIndex=1;
        this.expenseHeadService.expenseHeadList = [];
        await this.fetchexpenseHeadList(this.expenseHeadService.pageIndex, this.expenseHeadService.pageSize,searchTerm);
        this.expenseHeadService.pageIndex+=1;

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
