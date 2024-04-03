import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { RegionService } from './region.service';
import { FormsModule } from '@angular/forms';
import * as myGlobalVar from '../global';


@Component({
  selector: 'app-region',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
       
  ],
})
export class RegionPage implements OnInit {

  constructor(public regionService : RegionService, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.regionService.searchTerm = "";
    this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
    this.regionService.pageIndex += 1;
    
  }

  ionViewWillEnter(){
    this.regionService.searchTerm = "";
    this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
    this.regionService.pageIndex += 1;
  }

  public async fetchRegionList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.regionService.refreshRegionList(pageIndex,pageSize,searchTerm,myGlobalVar.TypeCodeRegion);

  }

  public async onScrollLoadData(ev){
    
    if(this.regionService.regionList.length !== this.regionService.totalCount){

       this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
       this.regionService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }
      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.regionService.showSearchBar = !this.regionService.showSearchBar;
      }
     
      public async cancelSearch() {
        this.regionService.showSearchBar = false;
        this.regionService.searchTerm = "";
        this.regionService.pageIndex = 1;
        this.regionService.regionList = [];
        await this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
        this.regionService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.regionService.pageIndex=1;
        this.regionService.regionList = [];
        await this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize,searchTerm);
        this.regionService.pageIndex+=1;

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
