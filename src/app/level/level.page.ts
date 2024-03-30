import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { LevelService } from './level.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    FormsModule
],
})
export class LevelPage implements OnInit {

  constructor(public levelService : LevelService, private toastCtrl:ToastController) { }

  ngOnInit() {

    this.levelService.searchTerm = "";
    this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
    this.levelService.pageIndex += 1;


  }

  
  public async fetchLevelList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.levelService.refreshLevelList(pageIndex,pageSize,searchTerm);

  }

  public async onScrollLoadData(ev){
    
    if(this.levelService.levelList.length !== this.levelService.totalCount){

       this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
       this.levelService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.levelService.showSearchBar = !this.levelService.showSearchBar;
      }

      public async cancelSearch() {
        this.levelService.showSearchBar = false;
        this.levelService.searchTerm = "";
        this.levelService.pageIndex = 1;
        this.levelService.levelList = [];
        await this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
        this.levelService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.levelService.pageIndex=1;
        this.levelService.levelList = [];
        await this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
        this.levelService.pageIndex+=1;

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
