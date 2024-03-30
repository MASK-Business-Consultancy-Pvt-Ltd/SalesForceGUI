import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Customer } from '../customer.model';
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
  
  loadedCustomer: Customer = {};
  ViewDataFlag=false;
  public customerForm! : FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    public customerService: CustomerService, private router: Router,
    private _fb: FormBuilder, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initcustomerForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('customerId')) {

        this.router.navigate(['/customer']);
        return;
      }

      if (paramMap.get('customerId')) {
        const customerId = JSON.parse(paramMap.get('customerId')!);
        this.ViewDataFlag = true;
        this.loadCustomerDetails(customerId);
      }
      else {
        this.loadCustomerDetails();
      }

    });
  }

  initcustomerForm() {
    this.customerForm = this._fb.group({
        id: [0],
        //customerCode: ['',Validators.required],
        customerName: ['',Validators.required],
        customerType: ['',Validators.required],
        contactNo: ['', Validators.required],
        //gender: ['', Validators.required],
        emailId: ['',Validators.required],
        active: ['0',Validators.required],
        territoryID: ['', Validators.required],
        billToAddress:['',Validators.required],
        shipToAddress:['',Validators.required]
    });
    this.customerForm.controls['active'].setValue('Y');
    this.customerService.getCustomerTypeList();
    this.customerService.getTerritoryList();
  }

  enableFormControl(EditFlag){

    if(EditFlag == true)
    {
       //this.customerForm.get('customerCode').enable();
       this.customerForm.get('customerName').enable();
       this.customerForm.get('customerType').enable();
       this.customerForm.get('contactNo').enable();
       this.customerForm.get('emailId').enable();
       //this.customerForm.get('gender').enable();
       this.customerForm.get('active').enable();
       this.customerForm.get('territoryID').enable();
       this.customerForm.get('billToAddress').enable();
       this.customerForm.get('shipToAddress').enable();
    }
    else
    {
       //this.customerForm.get('customerCode').disable();
       this.customerForm.get('customerName').disable();
       this.customerForm.get('customerType').disable();
       this.customerForm.get('contactNo').disable();
       this.customerForm.get('emailId').disable();
      // this.customerForm.get('gender').disable();
       this.customerForm.get('active').disable();
       this.customerForm.get('territoryID').disable();
       this.customerForm.get('billToAddress').disable();
       this.customerForm.get('shipToAddress').disable();
    }

}

loadCustomerDetails(customerId = -1) {

  if (customerId == -1) {
  }
  else {

    this.customerService.getCustomer(customerId).pipe(catchError(error => {

      this.showToast('Some error has been occured', 'danger');
      return throwError(() => error);

    })).subscribe(data => {
      debugger
      if (data.responseData) {
        this.loadedCustomer = data.responseData[0];
        this.customerForm.patchValue({
          id: this.loadedCustomer.id,
        //  customerCode: this.loadedCustomer.customerCode!,
          customerName: this.loadedCustomer.customerName!,
          customerType: this.loadedCustomer.customerType!,
          contactNo: this.loadedCustomer.contactNo!,
        //  gender: this.loadedCustomer.gender!,
          active: this.loadedCustomer.active!,
          emailId: this.loadedCustomer.emailId!,
          territoryID: this.loadedCustomer.territoryID!,
          billToAddress: this.loadedCustomer.billToAddress!,
          shipToAddress: this.loadedCustomer.shipToAddress!,
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

DeleteCustomer(){
      

  const customerId = this.loadedCustomer.id!;

    this.alertCtrl.create({
         header:'Are you sure?',
         message:'Do you really want to delete the Customer?',
         buttons:[{
            text:'Cancel',
            role:'cancel'

         },{
            text:'Delete',
            handler:() =>{

              this.loader.present();
              this.customerService.deleteCustomer(customerId).pipe(catchError(error=>{
                this.loader.dismiss();
      
                this.showToast('Some error has been occured','danger');
                return throwError(()=>error);
          
              })).subscribe(data=>{
                this.loader.dismiss();
                
                if(data.responseData)
                {
                  if(data.responseData.id == this.loadedCustomer.id && data.errCode == 0)
                  {
                      this.showToast('Customer Deleted Successfully','secondary');
                      this.customerService.resetValues();
                      this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
                      this.router.navigate(['/customer']);
        
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

onSubmit({value} : {value : Customer}){
  
  if(!value.id)
  {
    this.loader.present();
     this.customerService.AddCustomer(value).pipe(catchError(error=>{
      this.loader.dismiss();

     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Customer Added Successfully','secondary');
             this.customerService.resetValues();
             this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);;
             this.router.navigate(['/customer']);

       }

     }
   })
  }
  else
  {

    this.loader.present();
   this.customerService.updateCustomer(value.id,value).pipe(catchError(error=>{
    this.loader.dismiss(); 
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss(); 
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Customer updated Successfully','secondary');
             this.customerService.resetValues();
             this.fetchCustomerList(this.customerService.pageIndex, this.customerService.pageSize, this.customerService.searchTerm);
             this.router.navigate(['/customer']);

       }

     }

   })

  }

 
}

public async fetchCustomerList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.customerService.refreshCustomerList(pageIndex,pageSize,searchTerm);
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
