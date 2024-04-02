import { ProductTypeService } from './product-type.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { ProductType } from './product-type.model';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.page.html',
  styleUrls: ['./product-type.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      FormsModule
      
  ],
})
export class ProductTypePage implements OnInit {

  productTypeList : ProductType[];
  constructor(public productTypeService : ProductTypeService, private toastCtrl:ToastController) { }

  ngOnInit() { 
    this.productTypeService.searchTerm = "";
    this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
    console.log(this.fetchProductTypeList);
    this.productTypeService.pageIndex += 1;
  }

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){
    //this.loader.present();
    await this.productTypeService.refreshProductType(pageIndex,pageSize,searchTerm);
    
  }

  ionViewWillEnter() {
    this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
    console.log(this.fetchProductTypeList);
    this.productTypeService.pageIndex += 1;
  }

  public async onScrollLoadData(ev){
    
    if(this.productTypeService.productTypeList.length !== this.productTypeService.totalCount){

       this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
       this.productTypeService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.productTypeService.showSearchBar = !this.productTypeService.showSearchBar;
      }


      public async cancelSearch() {
        this.productTypeService.showSearchBar = false;
        this.productTypeService.searchTerm = "";
        this.productTypeService.pageIndex = 1;
        this.productTypeService.productTypeList = [];
        await this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
        this.productTypeService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.productTypeService.pageIndex=1;
        this.productTypeService.productTypeList = [];
        await this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize,searchTerm);
        this.productTypeService.pageIndex+=1;

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