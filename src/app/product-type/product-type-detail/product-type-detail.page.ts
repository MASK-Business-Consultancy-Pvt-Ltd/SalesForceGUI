import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ProductTypeService } from '../product-type.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductType } from '../product-type.model';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-product-type-detail',
  templateUrl: './product-type-detail.page.html',
  styleUrls: ['./product-type-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class ProductTypeDetailPage implements OnInit {

  loadedProductType: ProductType = {};
  ViewDataFlag = false;
  public productTypeForm = new FormGroup({
    groupCode: new FormControl(0),
    groupName:new FormControl('', Validators.required),
  });

  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private productTypeService: ProductTypeService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('productTypeId')) {

        this.router.navigate(['/productType']);
        return;
      }

      if (paramMap.get('productTypeId')) {
        const productTypeId = JSON.parse(paramMap.get('productTypeId')!);
        this.ViewDataFlag = true;
        this.loadProductTypeDetails(productTypeId);
      }
      else {
        this.loadProductTypeDetails();
      }

    });
  }




  enableFormControl(EditFlag) {

    if (EditFlag == true) {

      //this.productTypeForm.get('typeCode').enable();
      this.productTypeForm.get('groupName').enable();
      // this.productTypeForm.get('active').enable();
    }
    else {

      // this.productTypeForm.get('typeCode').disable();
      this.productTypeForm.get('groupName').disable();
      // this.productTypeForm.get('active').disable();

    }
  }

  loadProductTypeDetails(prodTypeId?: number) {

    if (prodTypeId) {

      this.productTypeService.getProductType(prodTypeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedProductType = data.responseData[0];
          this.productTypeForm.patchValue({
            groupCode: this.loadedProductType.groupCode,
            // typeCode: this.loadedProductType.typeCode!,
            groupName: this.loadedProductType.groupName,
            // active: this.loadedProductType.active!

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

  DeleteProductType() {


    const prodTypeId = this.loadedProductType.groupCode!;

    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete the product Type?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'

      }, {
        text: 'Delete',
        handler: () => {

          this.loader.present();
          this.productTypeService.deleteProductType(prodTypeId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.groupCode == this.loadedProductType.groupCode && data.errCode == 0) {
                this.showToast('Product Type Deleted Successfully', 'secondary');
                this.productTypeService.resetValues();
                this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
                this.router.navigate(['/product-type']);

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
    let value = { ...this.productTypeForm.value }

    if (!value.groupCode) {
      this.loader.present();

      this.productTypeService.AddProductType({groupName: value.groupName}).pipe(catchError(error => {
        this.loader.dismiss();
        console.log(value)
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();
          if (data.errCode == 0) {
            console.log(value)
            this.showToast('Product Type Added Successfully', 'secondary');
            this.productTypeService.resetValues();
            //this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
            this.router.navigate(['/product-type']);
          }

      })
    }
    else {

      this.loader.present();
      this.productTypeService.updateProductType(value.groupCode, value).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();
          if (data.errCode == 0) {
            this.showToast('Product Type updated Successfully', 'secondary');
            this.productTypeService.resetValues();
            //this.fetchProductTypeList(this.productTypeService.pageIndex, this.productTypeService.pageSize, this.productTypeService.searchTerm);
            this.router.navigate(['/product-type']);
          }
      })

    }


  }

  public async fetchProductTypeList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.productTypeService.refreshProductType(pageIndex, pageSize, searchTerm);


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
