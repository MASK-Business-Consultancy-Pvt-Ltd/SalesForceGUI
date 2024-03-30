import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { TerritoryService } from './territory.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-territory',
  templateUrl: './territory.page.html',
  styleUrls: ['./territory.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
  ],
})
export class TerritoryPage implements OnInit {

  constructor(public territoryService : TerritoryService, private toastCtrl:ToastController) { }

  ngOnInit() {
    
    this.territoryService.searchTerm = "";
    this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
    this.territoryService.pageIndex += 1;

  }

  public async fetchTerritoryList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.territoryService.refreshTerritoryList(pageIndex,pageSize,searchTerm);

  }

  public async onScrollLoadData(ev){
    
    if(this.territoryService.territoryList.length !== this.territoryService.totalCount){

       this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
       this.territoryService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.territoryService.showSearchBar = !this.territoryService.showSearchBar;
      }

      
      public async cancelSearch() {
        this.territoryService.showSearchBar = false;
        this.territoryService.searchTerm = "";
        this.territoryService.pageIndex = 1;
        this.territoryService.territoryList = [];
        await this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
        this.territoryService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.territoryService.pageIndex=1;
        this.territoryService.territoryList = [];
        await this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize,searchTerm);
        this.territoryService.pageIndex+=1;

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
 