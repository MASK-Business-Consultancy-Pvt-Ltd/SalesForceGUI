import { WorkingTypeService } from './working-type.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-working-type',
  templateUrl: './working-type.page.html',
  styleUrls: ['./working-type.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule],
})
export class WorkingTypePage implements OnInit {

  constructor(public workingTypeService : WorkingTypeService, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.workingTypeService.searchTerm = "";
    this.fetchworkingTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
    this.workingTypeService.pageIndex += 1;
  }

  public async fetchworkingTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.workingTypeService.refreshworkingTypeList(pageIndex,pageSize,searchTerm);

  }


  public async onScrollLoadData(ev){
    
    if(this.workingTypeService.workingTypeList.length !== this.workingTypeService.totalCount){

       this.fetchworkingTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
       this.workingTypeService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.workingTypeService.showSearchBar = !this.workingTypeService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.workingTypeService.showSearchBar = false;
        this.workingTypeService.searchTerm = "";
        this.workingTypeService.pageIndex = 1;
        this.workingTypeService.workingTypeList = [];
        await this.fetchworkingTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
        this.workingTypeService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.workingTypeService.pageIndex=1;
        this.workingTypeService.workingTypeList = [];
        await this.fetchworkingTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize,searchTerm);
        this.workingTypeService.pageIndex+=1;

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
