import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { CustomerType } from '../customer-type.model';
import { CustomerTypeService } from '../customer-type.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
import * as myGlobalVar from '../../global';

@Component({
  selector: 'app-customer-type-detail',
  templateUrl: './customer-type-detail.page.html',
  styleUrls: ['./customer-type-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ]
})
export class CustomerTypeDetailPage implements OnInit {

  loadedCustomerType: CustomerType;
  ViewDataFlag = false;
  public customerTypeForm = new FormGroup({
    code: new FormControl(0),
    name: new FormControl('', Validators.required),
    type: new FormControl('')
  });

  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private customerTypeService: CustomerTypeService, private router: Router,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('customerTypeId')) {

        this.router.navigate(['/customerType']);
        return;
      }

      if (paramMap.get('customerTypeId')) {
        const customerTypeId = JSON.parse(paramMap.get('customerTypeId')!);
        this.ViewDataFlag = true;
        this.loadCustomerTypeDetails(customerTypeId);
      }
      else {
        this.loadCustomerTypeDetails();
      }

    });

    this.customerTypeForm.patchValue({
      type: myGlobalVar.CustomerTypeCode

    })

  }



  enableFormControl(EditFlag) {
    if (EditFlag == true) {
      // this.customerTypeForm.get('customerTypeCode').enable();
      this.customerTypeForm.get('name').enable();
    }
    else {
      // this.customerTypeForm.get('customerTypeCode').disable();
      this.customerTypeForm.get('name').disable();
    }
  }

  loadCustomerTypeDetails(customerTypeId?: number) {

    if (customerTypeId ) {

      this.customerTypeService.getCustomerType(customerTypeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedCustomerType = data.responseData[0];
          this.customerTypeForm.patchValue({
            code: this.loadedCustomerType.code,
            // customerTypeCode: this.loadedCustomerType.customerTypeCode!,
            name: this.loadedCustomerType.name,
            type: myGlobalVar.CustomerTypeCode

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


  DeleteCustomerType() {


    const customerTypeId = this.loadedCustomerType.code!;

    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete the customer Type?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'

      }, {
        text: 'Delete',
        handler: () => {

          this.loader.present();
          this.customerTypeService.deleteCustomerType(customerTypeId).pipe(catchError(error => {
            this.loader.dismiss();

            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedCustomerType.code && data.errCode == 0) {
                this.showToast('Customer Type Deleted Successfully', 'secondary');
                this.customerTypeService.resetValues()
                this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
                this.router.navigate(['/customer-type']);

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


  onSubmit() {
    let value = { ...this.customerTypeForm.value }
    if (!value.code) {
      this.loader.present();
      this.customerTypeService.AddCustomerType(value).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();
        if (data.errCode == 0) {
          this.showToast('Customer Type Added Successfully', 'secondary');
          this.customerTypeService.resetValues()
          this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
          this.router.navigate(['/customer-type']);
        }
      })
    }
    else {
      this.loader.present();
      this.customerTypeService.updateCustomerType(value.code, value).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();

        if (data.errCode == 0) {
          this.showToast('Customer Type updated Successfully', 'secondary');
          this.customerTypeService.resetValues()
          this.fetchCustomerTypeList(this.customerTypeService.pageIndex, this.customerTypeService.pageSize, this.customerTypeService.searchTerm);
          this.router.navigate(['/customer-type']);
        }
      })
    }


  }

  public async fetchCustomerTypeList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.customerTypeService.refreshCustomerTypeList(pageIndex, pageSize, searchTerm);
    this.customerTypeService.pageIndex += 1;


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
