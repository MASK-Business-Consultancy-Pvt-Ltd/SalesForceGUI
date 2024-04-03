import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../products.model';
import { NgFor, NgIf } from '@angular/common';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgFor,
    RouterLink,
    ReactiveFormsModule

  ]

})
export class ProductDetailPage implements OnInit {

  loadedProduct: Product;
  ViewDataFlag = false;
  public productForm = new FormGroup({
    itemCode : new FormControl(''),
    itemName: new FormControl('',[Validators.required]),
    itemsGroupCode: new FormControl(0,[Validators.required]),
    valid: new FormControl('Y',[Validators.required])
  });

  constructor(private activatedRoute: ActivatedRoute,
    public productService: ProductsService, private router: Router,
    private _fb: FormBuilder, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) {

  }

  ngOnInit() {
    this.productService.getProductTypeList()
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('productId')) {

        this.router.navigate(['/products']);
        return;
      }

      if (paramMap.get('productId')) {
        const productId = paramMap.get('productId');
        this.ViewDataFlag = true;
        this.productForm.patchValue({
          itemCode : productId
        })
        this.loadProductDetails(productId);
      }
      else {
        this.loadProductDetails();
      }

    });
  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.productForm.get('itemCode').disable();
      this.productForm.get('itemName').enable();
      this.productForm.get('itemsGroupCode').enable();
      this.productForm.get('valid').enable();

    }
    else {
      this.productForm.get('itemCode').disable();
      this.productForm.get('itemName').disable();
      this.productForm.get('itemsGroupCode').disable();
      this.productForm.get('valid').disable();
    }


  }

  loadProductDetails(prodId?:string) {

    if (prodId) {

      this.productService.getProduct(prodId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedProduct = data.responseData[0];
          this.productForm.patchValue({
            itemCode: this.loadedProduct.itemCode,
            itemName: this.loadedProduct.itemName,
            itemsGroupCode: this.loadedProduct.itemsGroupCode,
            valid: this.loadedProduct.valid,

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

  // DeleteProduct() {


  //   const prodId = this.loadedProduct.id!;

  //   this.alertCtrl.create({
  //     header: 'Are you sure?',
  //     message: 'Do you really want to delete the product?',
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel'

  //     }, {
  //       text: 'Delete',
  //       handler: () => {

  //         this.loader.present();
  //         this.productService.deleteProduct(prodId).pipe(catchError(error => {
  //           this.loader.dismiss();
  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {
  //           this.loader.dismiss();

  //           if (data.responseData) {
  //             if (data.responseData.id == this.loadedProduct.id && data.errCode == 0) {
  //               this.showToast('Product Deleted Successfully', 'secondary');
  //               this.productService.resetValues();
  //               this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
  //               this.router.navigate(['/products']);

  //             }
  //           }


  //         })

  //       }


  //     }
  //     ]

  //   }).then(alertElement => {

  //     alertElement.present();
  //   })

  // }

  onSubmit() {
    
    this.activatedRoute.paramMap.subscribe(paramMap => {
      let value = {...this.productForm.value}
      let productId = paramMap.get('productId')

      if (productId == '') {
        this.loader.present();
        this.productService.AddProduct(value as Product).pipe(catchError(error => {
          this.loader.dismiss();
  
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);
  
        })).subscribe(data => {
          this.loader.dismiss();
  
            if (data.errCode == 0) {
              this.showToast('Product Added Successfully', 'secondary');
              this.productService.resetValues();
              //this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
              this.router.navigate(['/products']);
  
            }
  
        })
      }
      else {
  
        this.loader.present();
        this.productService.updateProduct(productId, value as Product).pipe(catchError(error => {
          this.loader.dismiss();
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);
  
        })).subscribe(data => {
          this.loader.dismiss();
  
            if (data.errCode == 0) {
              this.showToast('Product updated Successfully', 'secondary');
              this.productService.resetValues();
              //this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
              this.router.navigate(['/products']);
  
            }
  
  
        })
  
      }
    })


  }

  public async fetchProductList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.productService.refreshProductList(pageIndex, pageSize, searchTerm);
    this.productService.pageIndex += 1;

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
