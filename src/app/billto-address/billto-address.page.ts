import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { BillToAddrsService } from './billto-address.service'; 
@Component({
  selector: 'app-billto-address',
  templateUrl: './billto-address.page.html',
  styleUrls: ['./billto-address.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    FormsModule
  ],
})
export class BilltoAddressPage implements OnInit {

  constructor(public billToAddrsService : BillToAddrsService, private toastCtrl:ToastController) { }

  ngOnInit() {
    this.billToAddrsService.searchTerm = "";
    this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
    this.billToAddrsService.pageIndex += 1;
  }

  public async fetchbillToAddrs(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.billToAddrsService.refreshBillToAddrsList(pageIndex,pageSize,searchTerm);

  }


  public async onScrollLoadData(ev){
    
    if(this.billToAddrsService.billToAddrsList.length !== this.billToAddrsService.totalCount){

       this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
       this.billToAddrsService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.billToAddrsService.showSearchBar = !this.billToAddrsService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.billToAddrsService.showSearchBar = false;
        this.billToAddrsService.searchTerm = "";
        this.billToAddrsService.pageIndex = 1;
        this.billToAddrsService.billToAddrsList = [];
        await this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
        this.billToAddrsService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.billToAddrsService.pageIndex=1;
        this.billToAddrsService.billToAddrsList = [];
        await this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize,searchTerm);
        this.billToAddrsService.pageIndex+=1;

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
