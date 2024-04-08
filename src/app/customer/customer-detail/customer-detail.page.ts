import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, IonInput, ToastController } from '@ionic/angular';
import { AddCustomerCard, AddressInfo, CardInfo } from '../customer.model';
import { CustomerService } from '../customer.service';
import { LoaderService } from 'src/app/common/loader.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.page.html',
  styleUrls: ['./customer-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class CustomerDetailPage implements OnInit {

  loadedCustomer: CardInfo;
  ViewDataFlag = false;

  constructor(private activatedRoute: ActivatedRoute,
    public customerService: CustomerService, private router: Router,
    private _fb: FormBuilder, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService,
  ) { }

  ngOnInit() {
    
    this.initcustomerForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log(this.customerService.customerForm.value);


      if (!paramMap.has('customerId')) {

        this.router.navigate(['/customer']);
        return;
      }

      if (paramMap.get('customerId')) {
        const customerId = paramMap.get('customerId');
        this.ViewDataFlag = true;
        this.loadCustomerDetails(customerId);
      }
      else {
        this.initcustomerForm();
        this.loadCustomerDetails();
      }

    });
  }

  initcustomerForm() {

    this.customerService.customerForm.controls.taxId0.valueChanges.subscribe(value => {
      if(value){
        this.customerService.customerForm.controls.taxId0.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });


    this.customerService.customerForm.patchValue({
      valid: "Y",
      cardType: "C",
      series: 89
    })
    this.customerService.getCustomerTypeList();
    this.customerService.getTerritoryList();
  }

  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.customerService.customerForm.controls.cardName.enable()
      this.customerService.customerForm.controls.groupCode.enable()
      this.customerService.customerForm.controls.cellular.enable()
      this.customerService.customerForm.controls.emailAddress.enable()
      this.customerService.customerForm.controls.valid.enable()
      this.customerService.customerForm.controls.territory.enable()
    }
    else {
      this.customerService.customerForm.controls.cardName.disable()
      this.customerService.customerForm.controls.groupCode.disable()
      this.customerService.customerForm.controls.cellular.disable()
      this.customerService.customerForm.controls.emailAddress.disable()
      this.customerService.customerForm.controls.valid.disable()
      this.customerService.customerForm.controls.territory.disable()

    }

  }

  loadCustomerDetails(customerId?: string) {

    if (customerId) {

      this.customerService.getCustomer(customerId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        if (data.responseData.length > 0) {
          this.loadedCustomer = data.responseData[0];
          if(this.customerService.customerForm.value.cardCode != ""){
            console.log('this.customerService.customerForm.value.cardCode != ""');
            console.log(this.customerService.customerForm.value);
            
          }else{
            
            this.customerService.customerForm.patchValue({
              cardCode: this.loadedCustomer.cardCode,
              cardName: this.loadedCustomer.cardName,
              cardType: this.loadedCustomer.cardType,
              cellular: this.loadedCustomer.cellular,
              emailAddress: this.loadedCustomer.emailAddress,
              groupCode: this.loadedCustomer.groupCode,
              series: this.loadedCustomer.series,
              territory: this.loadedCustomer.territory,
              valid: this.loadedCustomer.valid,
              bpFiscalTaxIDCollection: [{ taxId0: this.loadedCustomer.taxId0 }],
            })
            this.customerService.customerForm.controls.bpAddresses.clear()
            this.customerService.customerForm.controls.bpAddresses.value.push(...this.loadedCustomer.billtoBPAddresses)
            this.customerService.customerForm.controls.shiptoBPAddresses.clear()
            this.customerService.customerForm.controls.shiptoBPAddresses.value.push(...this.loadedCustomer.shiptoBPAddresses)

            console.log(this.customerService.customerForm.value);
            
          }
        }

      })

      this.enableFormControl(false);

    }else{
      this.customerService.customerForm.reset()
      this.initcustomerForm();

    }
  }


  ChangeViewDataFlag() {

    this.ViewDataFlag = false;
    this.enableFormControl(true);

  }

  // DeleteCustomer(){


  //   const customerId = this.loadedCustomer.cardCode!;

  //     this.alertCtrl.create({
  //          header:'Are you sure?',
  //          message:'Do you really want to delete the Customer?',
  //          buttons:[{
  //             text:'Cancel',
  //             role:'cancel'

  //          },{
  //             text:'Delete',
  //             handler:() =>{

  //               this.loader.present();
  //               this.customerService.deleteCustomer(customerId).pipe(catchError(error=>{
  //                 this.loader.dismiss();

  //                 this.showToast('Some error has been occured','danger');
  //                 return throwError(()=>error);

  //               })).subscribe(data=>{
  //                 this.loader.dismiss();

  //                 if(data.responseData)
  //                 {
  //                   if(data.responseData[0].cardCode == this.loadedCustomer.id && data.errCode == 0)
  //                   {
  //                       this.showToast('Customer Deleted Successfully','secondary');
  //                       this.customerService.resetValues();
  //                       this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
  //                       this.router.navigate(['/customer']);

  //                   }
  //                 }


  //               })

  //             }


  //          }
  //         ]

  //          }).then(alertElement =>{

  //             alertElement.present();
  //          })

  // }

  onSubmit() {


    let value: AddCustomerCard = { ...this.customerService.customerForm.value } as AddCustomerCard

    console.log(value);

    if (!value.cardCode) {
      this.loader.present();
      this.customerService.AddCustomer(value).pipe(catchError(error => {
        this.loader.dismiss();

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Customer Added Successfully', 'secondary');
          this.customerService.resetValues();
          this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);;
          this.router.navigate(['/customer']);

        }

      })
    }
    else {

      this.loader.present();
      this.customerService.updateCustomer(value.cardCode, value).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Customer updated Successfully', 'secondary');
          this.customerService.resetValues();
          this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
          this.router.navigate(['/customer']);

        }


      })

    }


  }

  public async fetchCustomerList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.customerService.refreshCustomerList(pageIndex, pageSize, searchTerm);
    this.customerService.pageIndex += 1;


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

  redirectToShipAddress() {
    this.router.navigate(['/shiptoaddress'], { queryParams: { cCode: this.loadedCustomer.cardCode ? this.loadedCustomer.cardCode : '' } })
  }
  redirectToBillAddress() {
    this.router.navigate(['/billToAddress'], { queryParams: { cCode: this.loadedCustomer.cardCode ? this.loadedCustomer.cardCode : '' } })
  }

  enableSave() {

  }

}
