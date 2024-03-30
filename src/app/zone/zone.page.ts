import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { ZoneService } from './zone.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Zone } from './zone.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.page.html',
  styleUrls: ['./zone.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
  ],
})
export class ZonePage implements OnInit {

  constructor(public zoneService : ZoneService, private toastCtrl:ToastController) { }

  ngOnInit() {
    debugger
    this.zoneService.resetValues();
    this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
    this.zoneService.pageIndex += 1;

  }

  public async fetchZoneList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.zoneService.refreshZoneList(pageIndex,pageSize,searchTerm);

  }


  public async onScrollLoadData(ev){
    
    if(this.zoneService.zoneList.length !== this.zoneService.totalCount){

       this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
       this.zoneService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.zoneService.showSearchBar = !this.zoneService.showSearchBar;
      }
      public async cancelSearch() {
        this.zoneService.resetValues();
        await this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
        this.zoneService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.zoneService.pageIndex=1;
        this.zoneService.pageSize = 10;
        this.zoneService.zoneList = [];
        await this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize,searchTerm);
        this.zoneService.pageIndex+=1;

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
