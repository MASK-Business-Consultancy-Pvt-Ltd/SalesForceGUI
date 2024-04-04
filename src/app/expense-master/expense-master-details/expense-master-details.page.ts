import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  loadedExpenseMaster: ExpenseMaster;
  ViewDataFlag = false;
  public expenseMasterForm = new FormGroup({
    code: new FormControl('',[Validators.required]),
    u_Desgn: new FormControl('',[Validators.required]),
    u_DA_Local: new FormControl(0,[Validators.required]),
    u_DA_Outstn: new FormControl(0,[Validators.required]),
    u_TA_Local: new FormControl(0,[Validators.required]),
    u_TA_Outstn: new FormControl(0,[Validators.required]),
  });
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    public expensemasterService: ExpenseMasterService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {

    this.expensemasterService.getEmployeeLevel()
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('expensemasterId')) {

        this.router.navigate(['/expensemaster']);
        return;
      }

      if (paramMap.get('expensemasterId')) {
        const expensemasterId = paramMap.get('expensemasterId');
        this.ViewDataFlag = true;
        this.expenseMasterForm.patchValue({
          code : expensemasterId
        })
        this.loadExpenseMasterDetails(expensemasterId);
      }
      else {
        this.loadExpenseMasterDetails();
      }

    });
  }

  enableFormControl(EditFlag) {
    if (EditFlag == true) {   
      this.expenseMasterForm.get('u_Desgn').enable();
      this.expenseMasterForm.get('u_DA_Local').enable();
      this.expenseMasterForm.get('u_DA_Outstn').enable();
      this.expenseMasterForm.get('u_TA_Local').enable();
      this.expenseMasterForm.get('u_TA_Outstn').enable();
    }
    else {
      this.expenseMasterForm.get('u_Desgn').disable();
      this.expenseMasterForm.get('u_DA_Local').disable();
      this.expenseMasterForm.get('u_DA_Outstn').disable();
      this.expenseMasterForm.get('u_TA_Local').disable();
      this.expenseMasterForm.get('u_TA_Outstn').disable();
  }
}

  loadExpenseMasterDetails(DesignationId?:string) {

    if (DesignationId) {
    
      this.expensemasterService.getExpenseMaster(DesignationId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedExpenseMaster = data.responseData[0];
          this.expenseMasterForm.patchValue({
            code: this.loadedExpenseMaster.code,
            u_Desgn: this.loadedExpenseMaster.u_Desgn,
            u_DA_Local: this.loadedExpenseMaster.u_DA_Local,
            u_DA_Outstn: this.loadedExpenseMaster.u_DA_Outstn,
            u_TA_Local: this.loadedExpenseMaster.u_TA_Local,
            u_TA_Outstn: this.loadedExpenseMaster.u_TA_Outstn,

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

  // DeleteExpenseMaster() {


  //   const expensemasterId = this.loadedExpenseMaster.code!;

  //   this.alertCtrl.create({
  //     header: 'Are you sure?',
  //     message: 'Do you really want to delete the Expense Head ?',
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel'

  //     }, {
  //       text: 'Delete',
  //       handler: () => {

  //         this.loader.present();
  //         this.expensemasterService.deleteExpenseMaster(expensemasterId).pipe(catchError(error => {
  //           this.loader.dismiss();
  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {
  //           this.loader.dismiss();

  //           if (data.responseData) {
  //             if (data.responseData.id == this.loadedExpenseMaster.id && data.errCode == 0) {
  //               this.showToast('Expense Master  Deleted Successfully', 'secondary');
  //               this.expensemasterService.resetValues();
  //               this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
  //               this.router.navigate(['/expensemaster']);

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

      let value = {...this.expenseMasterForm.value}
      if (paramMap.get('expensemasterId') =='') {
        this.loader.present();
        this.expensemasterService.AddExpenseMaster(value as ExpenseMaster).pipe(catchError(error => {
          this.loader.dismiss(); 
  
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);
  
        })).subscribe(data => {
          this.loader.dismiss(); 
            if (data.errCode == 0) {
              this.showToast('Expense Head  Added Successfully', 'secondary');
              this.expensemasterService.resetValues();
              //this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
              this.router.navigate(['/expensemaster']);
            }
        })
      }
      else {
  
        this.loader.present();
        this.expensemasterService.updateExpenseMaster(paramMap.get('expensemasterId'), value as ExpenseMaster).pipe(catchError(error => {
          this.loader.dismiss(); 
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);
  
        })).subscribe(data => {
          this.loader.dismiss(); 
  
            if (data.errCode == 0) {
              this.showToast('Expense Head updated Successfully', 'secondary');
              this.expensemasterService.resetValues();
              //this.fetchProductTypeList(this.expensemasterService.pageIndex, this.expensemasterService.pageSize, this.expensemasterService.searchTerm);
              this.router.navigate(['/expensemaster']);
  
            }
  
  
        })
  
      }


    })

      


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
