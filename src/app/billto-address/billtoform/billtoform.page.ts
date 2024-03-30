import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { BillToAddrsService } from '../billto-address.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BillToAddrs } from '../billto-address.model';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-billToAddress-details.page',
  templateUrl: './billtoform.page.html',
  styleUrls: ['./billtoform.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class BilltoAddressPage implements OnInit {
  loadedBillToAddrs: BillToAddrs = {};
  ViewDataFlag = false;
  public billtoForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private billToAddrsService: BillToAddrsService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initExpenseForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('billtoform')) {

        this.router.navigate(['/billToAddress']);
        return;
      }

      if (paramMap.get('billtoform')) {
        const billtoform = JSON.parse(paramMap.get('billtoform')!);
        this.ViewDataFlag = true;
        this.loadExpenseMasterDetails(billtoform);
      }
      else {
        this.loadExpenseMasterDetails();
      }

    });
  }


  initExpenseForm() {

    this.billtoForm = this._fb.group({
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
      this.billtoForm.get('addressId').enable();
      this.billtoForm.get('block').enable();
      this.billtoForm.get('city').enable();
      this.billtoForm.get('zipCode').enable();
      this.billtoForm.get('state').enable();
      this.billtoForm.get('country').enable();
      this.billtoForm.get('gstNo').enable();
    }
    else {
      this.billtoForm.get('addressId').disable();
      this.billtoForm.get('block').disable();
      this.billtoForm.get('city').disable();
      this.billtoForm.get('zipCode').disable();
      this.billtoForm.get('state').disable();
      this.billtoForm.get('country').enable();
      this.billtoForm.get('gstNo').enable();
  }
}

  loadExpenseMasterDetails(DesignationId = -1) {

    if (DesignationId == -1) {
    }
    else {
      this.billToAddrsService.getBillToAddrs(DesignationId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedBillToAddrs = data.responseData[0];
          this.billtoForm.patchValue({
            id: this.loadedBillToAddrs.id,
            addressId: this.loadedBillToAddrs.addressId!,
            block: this.loadedBillToAddrs.block!,
            city: this.loadedBillToAddrs.city!,
            zipCode: this.loadedBillToAddrs.zipCode!,
            state: this.loadedBillToAddrs.state!,
            country: this.loadedBillToAddrs.country!,
            gstNo: this.loadedBillToAddrs.gstNo!

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


    const billtoform = this.loadedBillToAddrs.id!;

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
          this.billToAddrsService.deleteBillToAddrs(billtoform).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedBillToAddrs.id && data.errCode == 0) {
                this.showToast('Expense Master  Deleted Successfully', 'secondary');
                this.billToAddrsService.resetValues();
                this.fetchProductTypeList(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
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


  onSubmit({ value }: { value: BillToAddrs }) {
    
    if (!value.id) {
      this.loader.present();
      this.billToAddrsService.AddBillToAddrs(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head  Added Successfully', 'secondary');
            this.billToAddrsService.resetValues();
                this.fetchProductTypeList(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
            this.router.navigate(['/billToAddress']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.billToAddrsService.updateBillToAddrs(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head updated Successfully', 'secondary');
            this.billToAddrsService.resetValues();
                this.fetchProductTypeList(this.billToAddrsService.pageIndex, this.billToAddrsService.pageSize, this.billToAddrsService.searchTerm);
            this.router.navigate(['/billToAddress']);

          }

        }

      })

    }


  }

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
  
    await this.billToAddrsService.refreshBillToAddrsList(pageIndex,pageSize,searchTerm);
      
    
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
