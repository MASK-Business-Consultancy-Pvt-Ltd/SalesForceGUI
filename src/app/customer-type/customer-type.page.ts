import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { CustomerTypeService } from './customer-type.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.page.html',
  styleUrls: ['./customer-type.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
       
  ],
})
export class CustomerTypePage implements OnInit {

  constructor(public customerTypeService : CustomerTypeService, private toastCtrl:ToastController) { }

  ngOnInit() {
   
    this.customerTypeService.searchTerm = "";
    this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
    this.customerTypeService.pageIndex += 1;

  }

  ionViewWillEnter(){
    this.customerTypeService.searchTerm = "";
    this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
    this.customerTypeService.pageIndex += 1;
  }
  public async fetchCustomerTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.customerTypeService.refreshCustomerTypeList(pageIndex,pageSize,searchTerm);

  }

  public async onScrollLoadData(ev){
    
    if(this.customerTypeService.customerTypeList.length !== this.customerTypeService.totalCount){

       this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
       this.customerTypeService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }


      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.customerTypeService.showSearchBar = !this.customerTypeService.showSearchBar;
      }

      public async cancelSearch() {
        this.customerTypeService.showSearchBar = false;
        this.customerTypeService.searchTerm = "";
        this.customerTypeService.pageIndex = 1;
        this.customerTypeService.customerTypeList = [];
        await this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
        this.customerTypeService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.customerTypeService.pageIndex=1;
        this.customerTypeService.customerTypeList = [];
        await this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
        this.customerTypeService.pageIndex+=1;

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
