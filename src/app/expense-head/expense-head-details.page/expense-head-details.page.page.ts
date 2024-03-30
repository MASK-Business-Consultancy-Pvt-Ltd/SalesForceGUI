import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ExpenseHeadService } from '../expense-head.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ExpenseHead } from '../expense-head.model';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-expense-head-details.page',
  templateUrl: './expense-head-details.page.page.html',
  styleUrls: ['./expense-head-details.page.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class ExpenseHeadDetailsPagePage implements OnInit {
  loadedExpenseHead: ExpenseHead = {};
  ViewDataFlag = false;
  public ExpenseHeadForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private expenseheadService: ExpenseHeadService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initExpenseForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('ExpenseHeadId')) {

        this.router.navigate(['/expense-head']);
        return;
      }

      if (paramMap.get('ExpenseHeadId')) {
        const ExpenseHeadId = JSON.parse(paramMap.get('ExpenseHeadId')!);
        this.ViewDataFlag = true;
        this.loadProductTypeDetails(ExpenseHeadId);
      }
      else {
        this.loadProductTypeDetails();
      }

    });
  }


  initExpenseForm() {

    this.ExpenseHeadForm = this._fb.group({
      id: [0],
      typeCode: ['', Validators.required],
      typeName: ['', Validators.required],
      active: ['', Validators.required],
    });
    this.ExpenseHeadForm.controls['active'].setValue('Y');
  }


  enableFormControl(EditFlag) {
    if (EditFlag == true) {   
      this.ExpenseHeadForm.get('typeCode').enable();
      this.ExpenseHeadForm.get('typeName').enable();
      this.ExpenseHeadForm.get('active').enable();
    }
    else {
      this.ExpenseHeadForm.get('typeCode').disable();
      this.ExpenseHeadForm.get('typeName').disable();
      this.ExpenseHeadForm.get('active').disable();
    } 
  }

  loadProductTypeDetails(prodTypeId = -1) {

    if (prodTypeId == -1) {
    }
    else {
      this.expenseheadService.getExpenseHead(prodTypeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedExpenseHead = data.responseData[0];
          this.ExpenseHeadForm.patchValue({
            id: this.loadedExpenseHead.id,
            typeCode: this.loadedExpenseHead.typeCode!,
            typeName: this.loadedExpenseHead.typeName!,
            active: this.loadedExpenseHead.active!,

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

  DeleteExpenseHead() {


    const ExpenseHeadId = this.loadedExpenseHead.id!;

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
          this.expenseheadService.deleteExpenseHead(ExpenseHeadId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedExpenseHead.id && data.errCode == 0) {
                this.showToast('Expense Head  Deleted Successfully', 'secondary');
                this.expenseheadService.resetValues();
                this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
                this.router.navigate(['/expense-head']);

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


  onSubmit({ value }: { value: ExpenseHead }) {
    
    if (!value.id) {
      this.loader.present();
      this.expenseheadService.AddExpenseHead(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head  Added Successfully', 'secondary');
            this.expenseheadService.resetValues();
                this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
            this.router.navigate(['/expense-head']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.expenseheadService.updateExpenseHead(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Expense Head updated Successfully', 'secondary');
            this.expenseheadService.resetValues();
                this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
            this.router.navigate(['/expense-head']);

          }

        }

      })

    }


  }

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
  
    await this.expenseheadService.refreshexpenseheadList(pageIndex,pageSize,searchTerm);
      
    
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
