import { CommonService } from './../common/common.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { AreaService } from './area.service';
import { FormsModule } from '@angular/forms';
import * as myGlobalVar from '../global';


@Component({
  selector: 'app-area',
  templateUrl: './area.page.html',
  styleUrls: ['./area.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    FormsModule
    
],
})
export class AreaPage implements OnInit {

  constructor(public areaService : AreaService, private toastCtrl:ToastController) { }


  ngOnInit() { 
    this.areaService.searchTerm = "";
    this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
    this.areaService.pageIndex += 1;
  }

  ionViewWillEnter(){
    this.areaService.searchTerm = "";
    this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
    this.areaService.pageIndex += 1;
  }

  public async fetchAreaList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.areaService.refreshAreaList(pageIndex,pageSize,searchTerm,myGlobalVar.TypeCodeArea);

  }

  public async onScrollLoadData(ev){
    
    if(this.areaService.areaList.length !== this.areaService.totalCount){

       this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
       this.areaService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

    // ---------------For SeachBar---------------
    toggleSearchBar() {
      this.areaService.showSearchBar = !this.areaService.showSearchBar;
    }
    
    public async cancelSearch() {
      this.areaService.showSearchBar = false;
      this.areaService.searchTerm = "";
      this.areaService.pageIndex = 1;
      this.areaService.areaList = [];
      await this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
      this.areaService.pageIndex+=1;
    }

  public async search(searchTerm){
      this.areaService.pageIndex=1;
      this.areaService.areaList = [];
      await this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
      this.areaService.pageIndex+=1;
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
