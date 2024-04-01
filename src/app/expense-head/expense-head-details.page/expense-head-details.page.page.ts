import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  loadedExpenseHead: ExpenseHead;
  ViewDataFlag = false;
  public ExpenseHeadForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    u_active: new FormControl('', [Validators.required])
  });
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private expenseheadService: ExpenseHeadService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.ExpenseHeadForm.patchValue({
      u_active: 'Y'
    })
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('ExpenseHeadId')) {

        this.router.navigate(['/expense-head']);
        return;
      }

      if (paramMap.get('ExpenseHeadId')) {
        const ExpenseHeadId = paramMap.get('ExpenseHeadId');
        this.ViewDataFlag = true;
        this.loadProductTypeDetails(ExpenseHeadId);
      }
      else {
        this.loadProductTypeDetails();
      }

    });
  }




  enableFormControl(EditFlag) {
    if (EditFlag == true) {

      this.activatedRoute.paramMap.subscribe(paramMap => {

        if (!paramMap.has('ExpenseHeadId')) {
          this.ExpenseHeadForm.get('code').enable();
        }
      })
      this.ExpenseHeadForm.get('name').enable();
      this.ExpenseHeadForm.get('u_active').enable();
    }
    else {
      this.ExpenseHeadForm.get('code').disable();
      this.ExpenseHeadForm.get('name').disable();
      this.ExpenseHeadForm.get('u_active').disable();
    }
  }

  loadProductTypeDetails(expenseHeadCode?: string) {

    if (expenseHeadCode) {
      this.expenseheadService.getExpenseHead(expenseHeadCode).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedExpenseHead = data.responseData[0];
          this.ExpenseHeadForm.patchValue({
            code: this.loadedExpenseHead?.code as string,
            name: this.loadedExpenseHead?.name,
            u_active: this.loadedExpenseHead?.u_Active,

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

  // DeleteExpenseHead() {


  //   const ExpenseHeadId = this.loadedExpenseHead.code;

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
  //         this.expenseheadService.deleteExpenseHead(ExpenseHeadId).pipe(catchError(error => {
  //           this.loader.dismiss();
  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {
  //           this.loader.dismiss();

  //           if (data.responseData) {
  //             if (data.responseData.id == this.loadedExpenseHead.id && data.errCode == 0) {
  //               this.showToast('Expense Head  Deleted Successfully', 'secondary');
  //               this.expenseheadService.resetValues();
  //               this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
  //               this.router.navigate(['/expense-head']);

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
    let value = { ...this.ExpenseHeadForm.value }


    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.get('ExpenseHeadId') != '') {
        let ExpenseHeadCode = paramMap.get('ExpenseHeadId')
        this.loader.present();
        this.expenseheadService.updateExpenseHead(ExpenseHeadCode, value).pipe(catchError(error => {
          this.loader.dismiss();
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);

        })).subscribe(data => {
          this.loader.dismiss();

          if (data.errCode == 0) {
            this.showToast('Expense Head updated Successfully', 'secondary');
            this.expenseheadService.resetValues();
            //this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
            this.router.navigate(['/expense-head']);

          }
        })

      } else {
        this.loader.present();
        this.expenseheadService.AddExpenseHead(value).pipe(catchError(error => {
          this.loader.dismiss();

          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);

        })).subscribe(data => {
          this.loader.dismiss();

          if (data.errCode == 0) {
            this.showToast('Expense Head  Added Successfully', 'secondary');
            this.expenseheadService.resetValues();
            //this.fetchProductTypeList(this.expenseheadService.pageIndex, this.expenseheadService.pageSize, this.expenseheadService.searchTerm);
            this.router.navigate(['/expense-head']);

          }

        })
      }
    })
  }

  public async fetchProductTypeList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.expenseheadService.refreshexpenseheadList(pageIndex, pageSize, searchTerm);


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
