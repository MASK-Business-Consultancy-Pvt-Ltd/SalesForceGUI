import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { BillToAddrsService } from './billto-address.service';
import { CustomerService } from '../customer/customer.service';
import { AddressInfo } from '../customer/customer.model';

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
    FormsModule,
    JsonPipe
  ],
})
export class BilltoAddressPage implements OnInit {

  constructor(public billToAddrsService: BillToAddrsService, 
    private toastCtrl: ToastController, 
    public customerService: CustomerService,
    private alertCtrl:AlertController
    ) { }

  ngOnInit() {
    //this.billToAddrsService.searchTerm = "";
    //this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
    //this.billToAddrsService.pageIndex += 1;
    console.log(this.customerService.customerForm.value);


    this.billToAddrsService.availableAddressList = this.customerService.customerForm.controls.bpAddresses.value

  }

  ionViewWillEnter() {
    console.log(this.customerService.customerForm.value);

  }


  public async fetchbillToAddrs(pageIndex, pageSize, searchTerm) {

    //this.loader.present();

    await this.billToAddrsService.refreshBillToAddrsList(pageIndex, pageSize, searchTerm);

  }


  public async onScrollLoadData(ev) {

    if (this.billToAddrsService.billToAddrsList.length !== this.billToAddrsService.totalCount) {

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
    this.billToAddrsService.pageIndex += 1;
  }

  public async search(searchTerm) {
    this.billToAddrsService.pageIndex = 1;
    this.billToAddrsService.billToAddrsList = [];
    await this.fetchbillToAddrs(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, searchTerm);
    this.billToAddrsService.pageIndex += 1;

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

  public checkAvailableAddress(data: AddressInfo): boolean {
    const bpAddresses = this.customerService.customerForm.controls.bpAddresses.value;
    return bpAddresses.some((address: AddressInfo) => {
      // Assuming AddressInfo has an appropriate equality check, such as comparing IDs
      return address.addressName == data.addressName; // Adjust the comparison based on your AddressInfo structure
    });
  }

  public addAddressToCustomer(address: AddressInfo) {

    
    let alist: AddressInfo[] = this.customerService.customerForm.controls.bpAddresses.value.filter(i => {
      return i.addressName != address.addressName
    })
    this.customerService.customerForm.controls.bpAddresses.reset()
    this.customerService.customerForm.controls.bpAddresses.value.push(...alist)
    this.billToAddrsService.availableAddressList = this.customerService.customerForm.controls.bpAddresses.value

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
