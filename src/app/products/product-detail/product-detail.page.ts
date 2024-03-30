import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../products.model';
import { NgFor, NgIf } from '@angular/common';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
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

  loadedProduct:Product = {};
  ViewDataFlag=false;
  public productForm! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
    public productService: ProductsService,private router:Router,
    private _fb: FormBuilder,private alertCtrl : AlertController,
    private toastCtrl: ToastController, private loader: LoaderService){ 

  }

  ngOnInit() {

    this.initProductForm();

    this.activatedRoute.paramMap.subscribe(paramMap=>{
       
      if(!paramMap.has('productId')){
        
        this.router.navigate(['/products']);
        return;
      }

      if(paramMap.get('productId'))
      {
         const productId = JSON.parse(paramMap.get('productId')!);
         this.ViewDataFlag = true;
         this.loadProductDetails(productId);
      }
      else
      {
         this.loadProductDetails();
      }

    });
  }



  initProductForm() {
    
    this.productForm = this._fb.group({
        id: [0],
        productCode: ['',Validators.required],
        productName: ['',Validators.required],
        type:  ['', Validators.required],
        qtyInStock:  [0, Validators.required],
        active:  ['0', Validators.required]
    });
    this.productForm.controls['active'].setValue('Y');
    this.productService.getProductTypeList();
  }

   enableFormControl(EditFlag){

       if(EditFlag == true)
       {
          this.productForm.get('productCode').disable();
          this.productForm.get('productName').enable();
          this.productForm.get('type').enable();
          this.productForm.get('qtyInStock').enable();
          this.productForm.get('active').enable();

       } 
       else 
       {
          this.productForm.get('productCode').disable();
          this.productForm.get('productName').disable();
          this.productForm.get('type').disable();
          this.productForm.get('qtyInStock').disable();
          this.productForm.get('active').disable();
       }


   }

  loadProductDetails(prodId=-1){
    
    if(prodId == -1)
    {
    }
    else
    {

      this.productService.getProduct(prodId).pipe(catchError(error=>{
          
        this.showToast('Some error has been occured','danger');
        return throwError(()=>error);
  
      })).subscribe(data=>{
          
          if(data.responseData)
          {
              this.loadedProduct = data.responseData[0];
              this.productForm.patchValue({
                id: this.loadedProduct.id,
                productCode: this.loadedProduct.productCode!,
                productName: this.loadedProduct.productName!,
                type: this.loadedProduct.type!,
                qtyInStock: this.loadedProduct.qtyInStock!,
                active: this.loadedProduct.active!

              })
          }
  
      })

      this.enableFormControl(false);
        
    }
  }
 
  ChangeViewDataFlag(){
    
    this.ViewDataFlag = false;
    this.enableFormControl(true);

  }

  DeleteProduct(){
      

      const prodId = this.loadedProduct.id!;

        this.alertCtrl.create({
             header:'Are you sure?',
             message:'Do you really want to delete the product?',
             buttons:[{
                text:'Cancel',
                role:'cancel'

             },{
                text:'Delete',
                handler:() =>{

                  this.loader.present();
                  this.productService.deleteProduct(prodId).pipe(catchError(error=>{
                    this.loader.dismiss();
                    this.showToast('Some error has been occured','danger');
                    return throwError(()=>error);
              
                  })).subscribe(data=>{
                    this.loader.dismiss();
                    
                    if(data.responseData)
                    {
                      if(data.responseData.id == this.loadedProduct.id && data.errCode == 0)
                      {
                          this.showToast('Product Deleted Successfully','secondary');
                          this.productService.resetValues();
                          this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
                          this.router.navigate(['/products']);
            
                      }
                    }
                    
              
                  })

                }


             }
            ]

             }).then(alertElement =>{

                alertElement.present();
             })

  }

  onSubmit({value} : {value : Product}){
   
   if(!value.id)
   {
    this.loader.present();
      this.productService.AddProduct(value).pipe(catchError(error=>{
        this.loader.dismiss();

      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
       this.loader.dismiss();
      
      if(data.responseData)
      {
        if(data.responseData.id && data.errCode == 0)
        {
              this.showToast('Product Added Successfully','secondary');
              this.productService.resetValues();
              this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
              this.router.navigate(['/products']);

        }

      }
    })
   }
   else
   {

    this.loader.present();
    this.productService.updateProduct(value.id,value).pipe(catchError(error=>{
      this.loader.dismiss();   
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
      this.loader.dismiss();
      
      if(data.responseData)
      {
        if(data.responseData.id && data.errCode == 0)
        {
              this.showToast('Product updated Successfully','secondary');
              this.productService.resetValues();
              this.fetchProductList(this.productService.pageIndex, this.productService.pageSize, this.productService.searchTerm);
              this.router.navigate(['/products']);

        }

      }

    })

   }

  
}

public async fetchProductList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.productService.refreshProductList(pageIndex,pageSize,searchTerm);
  this.productService.pageIndex += 1;
  
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
