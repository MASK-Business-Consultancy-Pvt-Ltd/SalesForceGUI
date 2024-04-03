import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Product } from './products.model';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        RouterLink,
        NgFor,
        NgIf,
        FormsModule
        
    ],
})
export class ProductsPage implements OnInit {

  constructor(public productService : ProductsService, private toastCtrl:ToastController) { }

  ngOnInit() {
     
    this.productService.searchTerm = "";
    this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
    this.productService.pageIndex += 1;

  }

  ionViewWillEnter(){
    this.productService.searchTerm = "";
    this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
    this.productService.pageIndex += 1;
  }

  public async fetchProductList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.productService.refreshProductList(pageIndex,pageSize,searchTerm);

  }

  public async onScrollLoadData(ev){
    
    if(this.productService.productList.length !== this.productService.totalCount){

       this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
       this.productService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.productService.showSearchBar = !this.productService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.productService.showSearchBar = false;
        this.productService.searchTerm = "";
        this.productService.pageIndex = 1;
        this.productService.productList = [];
        await this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
        this.productService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.productService.pageIndex=1;
        this.productService.productList = [];
        await this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
        this.productService.pageIndex+=1;

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
