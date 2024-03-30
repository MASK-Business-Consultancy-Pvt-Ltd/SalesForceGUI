import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ExpenseMasterService } from '../expense-master.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ExpenseMaster } from '../expense-master.model';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-expensemaster-details.page',
  templateUrl: './expense-master-details.page.html',
  styleUrls: ['./expense-master-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class ExpenseMasterDetailsPage implements OnInit {
  loadedExpenseMaster: ExpenseMaster = {};
  ViewDataFlag = false;
  public expenseMasterForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private expensemasterService: ExpenseMasterService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initExpenseForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('expensemasterId')) {

        this.router.navigate(['/expensemaster']);
        return;
      }

      if (paramMap.get('expensemasterId')) {
        const expensemasterId = JSON.parse(paramMap.get('expensemasterId')!);
        this.ViewDataFlag = true;
        this.loadExpenseMasterDetails(expensemasterId);
      }
      else {
        this.loadExpenseMasterDetails();
      }

    });
  }


  initExpenseForm() {

    this.expenseMasterForm = this._fb.group({
      id: [0],
      DesignationId: ['', Validators.required],
      DailyAllowanceLocal: ['', Validators.required],
      DailyAllowanceOutStation: ['', Validators.required],
      TravelingAllowanceLocal: ['', Validators.required],
      TravelingAllowanceOutStation:['', Validators.required]
    });
  }


  enableFormControl(EditFlag) {
    if (EditFlag == true) {   
      this.expenseMasterForm.get('DesignationId').enable();
      this.expenseMasterForm.get('DailyAllowanceLocal').enable();
      this.expenseMasterForm.get('DailyAllowanceOutStation').enable();
      this.expenseMasterForm.get('TravelingAllowanceLocal').enable();
      this.expenseMasterForm.get('TravelingAllowanceOutStation').enable();
    }
    else {
      this.expenseMasterForm.get('DesignationId').disable();
      this.expenseMasterForm.get('DailyAllowanceLocal').disable();
      this.expenseMasterForm.get('DailyAllowanceOutStation').disable();
      this.expenseMasterForm.get('TravelingAllowanceLocal').disable();
      this.expenseMasterForm.get('TravelingAllowanceOutStation').disable();
  }
}

  loadExpenseMasterDetails(DesignationId = -1) {

    if (DesignationId == -1) {
    }
    else {
      this.expensemasterService.getExpenseMaster(DesignationId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedExpenseMaster = data.responseData[0];
          this.expenseMasterForm.patchValue({
            id: this.loadedExpenseMaster.id,
            DesignationId: this.loadedExpenseMaster.DesignationId!,
            DailyAllowanceLocal: this.loadedExpenseMaster.DailyAllowanceLocal!,
            DailyAllowanceOutStation: this.loadedExpenseMaster.DailyAllowanceOutStation!,
            TravelingAllowanceLocal: this.loadedExpenseMaster.TravelingAllowanceLocal!,
            TravelingAllowanceOutStation: this.loadedExpenseMaster.TravelingAllowanceOutStation!,

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


    const expensemasterId = this.loadedExpenseMaster.id!;

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
          this.expensemasterService.deleteExpenseMaster(expensemasterId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedExpenseMaster.id && data.errCode == 0) {
                this.showToast('Expense Master  Deleted Successfully', 'secondary');
                this.expensemasterService.resetValues();
                this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
                this.router.navigate(['/expensemaster']);

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


  onSubmit({ value }: { value: ExpenseMaster }) {
    
    if (!value.id) {
      this.loader.present();
      this.expensemasterService.AddExpenseMaster(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head  Added Successfully', 'secondary');
            this.expensemasterService.resetValues();
                this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
            this.router.navigate(['/expensemaster']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.expensemasterService.updateExpenseMaster(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head updated Successfully', 'secondary');
            this.expensemasterService.resetValues();
                this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
            this.router.navigate(['/expensemaster']);

          }

        }

      })

    }


  }

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
  
    await this.expensemasterService.refreshExpenseMasterList(pageIndex,pageSize,searchTerm);
      
    
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
