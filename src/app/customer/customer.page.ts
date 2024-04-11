import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    FormsModule

  ],
})
export class CustomerPage implements OnInit {


  constructor(public customerService: CustomerService, private toastCtrl: ToastController) { }

  ngOnInit() {

    this.customerService.searchTerm = "";
    this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
    this.customerService.pageIndex += 1;

  }

  
  ionViewWillEnter() {
    this.customerService.searchTerm = "";
    this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
    this.customerService.pageIndex += 1;
  }

  public async fetchCustomerList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();

    await this.customerService.refreshCustomerList(pageIndex, pageSize, searchTerm);

  }

  public async onScrollLoadData(ev) {

    if (this.customerService.customerList.length !== this.customerService.totalCount) {

      this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
      this.customerService.pageIndex += 1;

    }

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

  // ---------------For SeachBar---------------
  toggleSearchBar() {
    this.customerService.showSearchBar = !this.customerService.showSearchBar;
  }

  public async cancelSearch() {
    this.customerService.showSearchBar = false;
    this.customerService.searchTerm = "";
    this.customerService.pageIndex = 1;
    this.customerService.customerList = [];
    await this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
    this.customerService.pageIndex += 1;
  }

  public async search(searchTerm) {
    this.customerService.pageIndex = 1;
    this.customerService.customerList = [];
    await this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
    this.customerService.pageIndex += 1;

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
