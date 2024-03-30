import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ShiptoAddressService } from '../shipto-address.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ShipToAddrs } from '../shipto-address.model';
import { LoaderService } from 'src/app/common/loader.service';

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
  public ShipToAddrsForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private shipToAddrsService: ShiptoAddressService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initExpenseForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('shiptoaddressId')) {

        this.router.navigate(['/shiptoaddress']);
        return;
      }

      if (paramMap.get('shiptoaddressId')) {
        const shiptoaddressId = JSON.parse(paramMap.get('shiptoaddressId')!);
        this.ViewDataFlag = true;
        this.loadExpenseMasterDetails(shiptoaddressId);
      }
      else {
        this.loadExpenseMasterDetails();
      }

    });
  }


  initExpenseForm() {

    this.ShipToAddrsForm = this._fb.group({
      id: [0],
      addressId: ['', Validators.required],
      block: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      state:['', Validators.required],
      country: ['', Validators.required],
      gstNo: ['', Validators.required]   
    });
  }


  enableFormControl(EditFlag) {
    if (EditFlag == true) {   
      this.ShipToAddrsForm.get('addressId').enable();
      this.ShipToAddrsForm.get('block').enable();
      this.ShipToAddrsForm.get('city').enable();
      this.ShipToAddrsForm.get('zipCode').enable();
      this.ShipToAddrsForm.get('state').enable();
      this.ShipToAddrsForm.get('country').enable();
      this.ShipToAddrsForm.get('gstNo').enable();
    }
    else {
      this.ShipToAddrsForm.get('addressId').disable();
      this.ShipToAddrsForm.get('block').disable();
      this.ShipToAddrsForm.get('city').disable();
      this.ShipToAddrsForm.get('zipCode').disable();
      this.ShipToAddrsForm.get('state').disable();
      this.ShipToAddrsForm.get('country').enable();
      this.ShipToAddrsForm.get('gstNo').enable();
  }
}

  loadExpenseMasterDetails(addressId = -1) {

    if (addressId == -1) {
    }
    else {
      this.shipToAddrsService.getShipToAddrs(addressId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedShipToAddrs = data.responseData[0];
          this.ShipToAddrsForm.patchValue({
            id: this.loadedShipToAddrs.id,
            addressId: this.loadedShipToAddrs.addressId!,
            block: this.loadedShipToAddrs.block!,
            city: this.loadedShipToAddrs.city!,
            zipCode: this.loadedShipToAddrs.zipCode!,
            state: this.loadedShipToAddrs.state!,
            country: this.loadedShipToAddrs.country!,
            gstNo: this.loadedShipToAddrs.gstNo!

          })
        }

      })

      this.enableFormControl(false);

    }
  }

  ChangeViewDataFlag() {

    this.ViewDataFlag = false;
    this.enableFormControl(true);

  }

  DeleteExpenseMaster() {


    const shiptoaddressId = this.loadedShipToAddrs.id!;

    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete the Expense Head ?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'

      }, {
        text: 'Delete',
        handler: () => {

          this.loader.present();
          this.shipToAddrsService.deleteShipToAddrs(shiptoaddressId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedShipToAddrs.id && data.errCode == 0) {
                this.showToast('Expense Master  Deleted Successfully', 'secondary');
                this.shipToAddrsService.resetValues();
                this.fetchProductTypeList(this.shipToAddrsService.pageIndex, this.shipToAddrsService.pageSize, this.shipToAddrsService.searchTerm);
                this.router.navigate(['/billToAddress']);

              }
            }


          })

        }


      }
      ]

    }).then(alertElement => {

      alertElement.present();
    })

  }


  onSubmit({ value }: { value: ShipToAddrs }) {
    
    if (!value.id) {
      this.loader.present();
      this.shipToAddrsService.AddShipToAddrs(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head  Added Successfully', 'secondary');
            this.shipToAddrsService.resetValues();
                this.fetchProductTypeList(this.shipToAddrsService.pageIndex, this.shipToAddrsService.pageSize, this.shipToAddrsService.searchTerm);
            this.router.navigate(['/billToAddress']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.shipToAddrsService.updateShipToAddrs(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head updated Successfully', 'secondary');
            this.shipToAddrsService.resetValues();
                this.fetchProductTypeList(this.shipToAddrsService.pageIndex, this.shipToAddrsService.pageSize, this.shipToAddrsService.searchTerm);
            this.router.navigate(['/billToAddress']);

          }

        }

      })

    }


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



}
