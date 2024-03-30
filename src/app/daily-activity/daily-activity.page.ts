import { DailyActivityService } from './daily-activity.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-daily-activity',
  templateUrl: './daily-activity.page.html',
  styleUrls: ['./daily-activity.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
      
  ],
})
export class DailyActivityPage implements OnInit {

  constructor(public dailyActivityService : DailyActivityService, private toastCtrl:ToastController) { }

  ngOnInit() {
    
    this.dailyActivityService.searchTerm = "";
    this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
    this.dailyActivityService.pageIndex += 1;
  }

  
  public async fetchDailyActivityList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.dailyActivityService.refreshDailyActivityList(pageIndex,pageSize,searchTerm);

  }

  public async onScrollLoadData(ev){
    
    if(this.dailyActivityService.dailyActivityList.length !== this.dailyActivityService.totalCount){

       this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
       this.dailyActivityService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.dailyActivityService.showSearchBar = !this.dailyActivityService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.dailyActivityService.showSearchBar = false;
        this.dailyActivityService.searchTerm = "";
        this.dailyActivityService.pageIndex = 1;
        this.dailyActivityService.dailyActivityList = [];
        await this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
        this.dailyActivityService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.dailyActivityService.pageIndex=1;
        this.dailyActivityService.dailyActivityList = [];
        await this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize,searchTerm);
        this.dailyActivityService.pageIndex+=1;

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
