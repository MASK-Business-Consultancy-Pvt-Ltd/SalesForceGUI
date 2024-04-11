import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ShiptoAddressService } from '../shipto-address.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ShipToAddrs } from '../shipto-address.model';
import { LoaderService } from 'src/app/common/loader.service';
import { CustomerService } from 'src/app/customer/customer.service';
import { AddressInfo } from 'src/app/customer/customer.model';
import { EmployeeService } from 'src/app/employee/employee.service';

@Component({
  selector: 'app-shipToAddress-details.page',
  templateUrl: './shiptoform.page.html',
  styleUrls: ['./shiptoform.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class ShipToAddrsForm implements OnInit {
  loadedShipToAddrs: ShipToAddrs = {};
  ViewDataFlag = false;
  newRowNum: number = 0
  public ShipToAddrsForm = new FormGroup({
    addressName: new FormControl(''),
    street: new FormControl(''),
    block: new FormControl(''),
    zipCode: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl('IN'),
    state: new FormControl(''),
    addressType: new FormControl('bo_ShipTo'),
    bpCode: new FormControl(''),
    rowNum: new FormControl(0)
  });
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    public shipToAddrsService: ShiptoAddressService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService, private customerService:CustomerService,public employeeService : EmployeeService ) { }

  ngOnInit() {


    this.shipToAddrsService.getStateList('IN');
    this.employeeService.getCountryList();


    const allAddresses = [...this.customerService.customerForm.controls.bpAddresses.value, ...this.customerService.customerForm.controls.shiptoBPAddresses.value];

    const validAddresses = allAddresses.filter(obj => obj.rowNum != null && !isNaN(obj.rowNum) && obj.rowNum !== 0);
    
    if (allAddresses.length > 0) {
        this.newRowNum = allAddresses.reduce((maxId, obj) => (obj.rowNum > maxId ? obj.rowNum : maxId), -Infinity) + 1;
    } else {
        this.newRowNum = 0;
    }
    this.activatedRoute.paramMap.subscribe(param => {

      if (param.get('AddressRowNumber') != '') {
        let addressData: AddressInfo = allAddresses.filter(i => {
          return i.rowNum == +param.get('AddressRowNumber')
        })[0]
        this.ShipToAddrsForm.patchValue({
          addressName: addressData.addressName,
          addressType: addressData.addressType,
          block: addressData.block,
          bpCode: addressData.bpCode,
          city: addressData.city,
          country: addressData.country,
          rowNum: addressData.rowNum,
          state: addressData.state,
          street: addressData.street,
          zipCode: addressData.zipCode
        })


      } else {
        this.ShipToAddrsForm.reset()
        this.ShipToAddrsForm.patchValue({
          rowNum: this.newRowNum,
          addressType: 'bo_ShipTo',
          country: 'IN'
        })
      }

    })

    console.log('new  rownumber', this.newRowNum);
    
  }

  ChangeViewDataFlag() {

    this.ViewDataFlag = false;

  }

  onSubmit() {
    this.activatedRoute.paramMap.subscribe(param => {
      let formData = { ...this.ShipToAddrsForm.value }

      if (param.get('AddressRowNumber') != '') {

        console.log(this.shipToAddrsService.availableAddressList);

        let filteredItem: AddressInfo = this.shipToAddrsService.availableAddressList.filter(i => i.rowNum === +param.get('AddressRowNumber'))[0];
          filteredItem.addressName= formData.addressName,
          filteredItem.addressType= formData.addressType,
          filteredItem.block= formData.block,
          filteredItem.bpCode= formData.bpCode,
          filteredItem.city= formData.city,
          filteredItem.country= formData.country,
          filteredItem.rowNum= formData.rowNum,
          filteredItem.state= formData.state,
          filteredItem.street= formData.street,
          filteredItem.zipCode= formData.zipCode
        
        

      } else {
        let newAddress: AddressInfo = {
          addressName: formData.addressName,
          street: formData.street,
          block: formData.block,
          zipCode: formData.zipCode,
          city: formData.city,
          country: formData.country,
          state: formData.state,
          addressType: formData.addressType,
          bpCode: formData.bpCode,
          rowNum: formData.rowNum ? formData.rowNum : this.newRowNum
        }
        this.customerService.customerForm.controls.shiptoBPAddresses.value.push(newAddress)
        this.shipToAddrsService.availableAddressList = [...this.customerService.customerForm.controls.shiptoBPAddresses.value]

      }

      if (this.ShipToAddrsForm.valid) {
        this.router.navigate(['/shiptoaddress']);
      } else {
        this.showToast('Please fill in all information','danger')
      }
    })



  }


 

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
  
    await this.shipToAddrsService.refreshShipToAddrsList(pageIndex,pageSize,searchTerm);
      
    
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


  fetchStateList(event:any){
    this.employeeService.getStateList('IN')
  }
  fetchCountryList(){
    this.employeeService.getCountryList();

  }
}
