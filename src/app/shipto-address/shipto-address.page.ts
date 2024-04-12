import { ShiptoAddressService } from './shipto-address.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { AddressInfo } from '../customer/customer.model';
import { CustomerService } from '../customer/customer.service';

@Component({
  selector: 'app-shipto-address',
  templateUrl: './shipto-address.page.html',
  styleUrls: ['./shipto-address.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    FormsModule],
})
export class ShiptoAddressPage implements OnInit {

  constructor(public shiptoAddressService: ShiptoAddressService, private toastCtrl: ToastController, 
    public customerService: CustomerService,private alertCtrl:AlertController
    ) { }

  ngOnInit() {
    // this.shiptoAddressService.searchTerm = "";
    // this.fetchexpenseHeadList(this.shiptoAddressService.pageIndex, this.shiptoAddressService.pageSize, this.shiptoAddressService.searchTerm);
    // this.shiptoAddressService.pageIndex += 1;
    this.shiptoAddressService.availableAddressList = this.customerService.customerForm.controls.shiptoBPAddresses.value as AddressInfo[]
  }

  public async fetchexpenseHeadList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();

    await this.shiptoAddressService.refreshShipToAddrsList(pageIndex, pageSize, searchTerm);

  }


  public async onScrollLoadData(ev) {

    if (this.shiptoAddressService.ShipToAddrsList.length !== this.shiptoAddressService.totalCount) {

      this.fetchexpenseHeadList(this.shiptoAddressService.pageIndex, this.shiptoAddressService.pageSize, this.shiptoAddressService.searchTerm);
      this.shiptoAddressService.pageIndex += 1;

    }

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

  // ---------------For SeachBar---------------
  toggleSearchBar() {
    this.shiptoAddressService.showSearchBar = !this.shiptoAddressService.showSearchBar;
  }

  public async cancelSearch() {
    this.shiptoAddressService.showSearchBar = false;
    this.shiptoAddressService.searchTerm = "";
    this.shiptoAddressService.pageIndex = 1;
    this.shiptoAddressService.ShipToAddrsList = [];
    await this.fetchexpenseHeadList(this.shiptoAddressService.pageIndex, this.shiptoAddressService.pageSize, this.shiptoAddressService.searchTerm);
    this.shiptoAddressService.pageIndex += 1;
  }

  public async search(searchTerm) {
    this.shiptoAddressService.pageIndex = 1;
    this.shiptoAddressService.ShipToAddrsList = [];
    await this.fetchexpenseHeadList(this.shiptoAddressService.pageIndex, this.shiptoAddressService.pageSize, searchTerm);
    this.shiptoAddressService.pageIndex += 1;

  }


  async showToast(ToastMsg, colorType) {
    await this.toastCtrl.create({
      message: ToastMsg,
      duration: 2000,
      position: 'top',
      color: colorType,
      buttons: [{
        text: 'ok',
        handler: () => {
          //console.log("ok clicked");
        }
      }]
    }).then(res => res.present());
  }


  public addAddressToCustomer(address: AddressInfo) {
    console.log(address);
    
    let alist: AddressInfo[] = this.customerService.customerForm.controls.shiptoBPAddresses.value.filter(i => {
      return i.addressName != address.addressName
    })
    this.customerService.customerForm.controls.shiptoBPAddresses.reset()
    this.customerService.customerForm.controls.shiptoBPAddresses.value.push(...alist)
    console.log(this.customerService.customerForm.controls.shiptoBPAddresses.value);
    this.shiptoAddressService.availableAddressList = this.customerService.customerForm.controls.shiptoBPAddresses.value
  }


  async presentAlert(address: AddressInfo) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${address.addressName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => {
            this.addAddressToCustomer(address); // Call deleteAddress method with the address
          },
        },
      ],
    });

    alert.present();
  }

  



  
  handleAlertDismiss(event: any) {
    // Handle alert dismiss if needed
    console.log('Alert dismissed:', event);
  }
}

