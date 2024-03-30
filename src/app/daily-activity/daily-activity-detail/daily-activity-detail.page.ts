import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { DailyActivityService } from '../daily-activity.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DailyActivity } from '../daily-activity.model';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-daily-activity-detail',
  templateUrl: './daily-activity-detail.page.html',
  styleUrls: ['./daily-activity-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class DailyActivityDetailPage implements OnInit {
  loadedDailyActivity: DailyActivity = {};
  ViewDataFlag = false;
  public dailyActivityForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    public dailyActivityService: DailyActivityService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    console.log(this.dailyActivityForm)
    this.initDailyActivityForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('dailyactivityId')) {

        this.router.navigate(['/dailyactivity']);
        return;
      }

      if (paramMap.get('dailyactivityId')) {
        const dailyactivityId = JSON.parse(paramMap.get('dailyactivityId')!);
        this.ViewDataFlag = true;
        this.loadDailyActivityDetails(dailyactivityId);
      }
      else {
        this.loadDailyActivityDetails();
      }

    });
  }
 
  initDailyActivityForm() {

    this.dailyActivityForm = this._fb.group({
      id: [0],
      TerritoryId: ['', Validators.required],
      DoctorId: ['', Validators.required],
      ChemistId: ['', Validators.required],
      StockistId: ['', Validators.required],
      ProductId: ['', Validators.required],
      WorkingTypeId: ['', Validators.required],
      VisitedWithId: ['', Validators.required],
      CheckInTime:[ Validators.required],
      CheckOutTime:[ Validators.required],
      Remark:[Validators.required]
    });
    this.dailyActivityService.getProductTypeList();
    this.dailyActivityService.getTerritoryList();
    this.dailyActivityService.getWorkingTypeList();
  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {  
      this.dailyActivityForm.get('TerritoryId').enable();
      this.dailyActivityForm.get('DoctorId').enable();
      this.dailyActivityForm.get('ChemistId').enable();
      this.dailyActivityForm.get('StockistId').enable();
      this.dailyActivityForm.get('ProductId').enable();
      this.dailyActivityForm.get('WorkingTypeId').enable();
      this.dailyActivityForm.get('VisitedWithId').enable();
      this.dailyActivityForm.get('CheckInTime').enable();
      this.dailyActivityForm.get('CheckOutTime').enable();
      this.dailyActivityForm.get('Remark').enable();
      
    }
    else {
      this.dailyActivityForm.get('TerritoryId').disable();
      this.dailyActivityForm.get('DoctorId').disable();
      this.dailyActivityForm.get('ChemistId').disable();
      this.dailyActivityForm.get('StockistId').disable();
      this.dailyActivityForm.get('ProductId').disable();
      this.dailyActivityForm.get('WorkingTypeId').disable();
      this.dailyActivityForm.get('VisitedWithId').disable();
      this.dailyActivityForm.get('CheckInTime').disable();
      this.dailyActivityForm.get('CheckOutTime').disable();
      this.dailyActivityForm.get('Remark').disable();

    } 
  }

  loadDailyActivityDetails(dailyactivityId = -1) {

    if (dailyactivityId == -1) {
    }
    else {

      this.dailyActivityService.getDailyActivity(dailyactivityId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedDailyActivity = data.responseData[0];
          this.dailyActivityForm.patchValue({
            id: this.loadedDailyActivity.id,
            TerritoryId: this.loadedDailyActivity.TerritoryId!,
            DoctorId: this.loadedDailyActivity.DoctorId!,
            ChemistId: this.loadedDailyActivity.ChemistId!,
            StockistId: this.loadedDailyActivity.StockistId!,
            ProductId: this.loadedDailyActivity.ProductId!,
            WorkingTypeId: this.loadedDailyActivity.WorkingTypeId!,
            VisitedWithId: this.loadedDailyActivity.VisitedWithId!,
            CheckInTime: this.loadedDailyActivity.CheckInTime!,
            CheckOutTime: this.loadedDailyActivity.CheckOutTime!,
            Remark:this.loadedDailyActivity.Remark!
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


    const dailyactivityId = this.loadedDailyActivity.id!;

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
          this.dailyActivityService.deleteDailyActivity(dailyactivityId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData.id == this.loadedDailyActivity.id && data.errCode == 0) {
                this.showToast('Product Type Deleted Successfully', 'secondary');
                this.dailyActivityService.resetValues();
                this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
                this.router.navigate(['/dailyactivity']);

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


  onSubmit({ value }: { value: DailyActivity }) {
    
    if (!value.id) {
      this.loader.present();
      this.dailyActivityService.AddDailyActivity(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Product Type Added Successfully', 'secondary');
            this.dailyActivityService.resetValues();
                this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
            this.router.navigate(['/dailyactivity']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.dailyActivityService.updateDailyActivity(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Product Type updated Successfully', 'secondary');
            this.dailyActivityService.resetValues();
                this.fetchDailyActivityList(this.dailyActivityService.pageIndex, this.dailyActivityService.pageSize, this.dailyActivityService.searchTerm);
            this.router.navigate(['/dailyactivity']);

          }

        }

      })

    }


  }

  public async fetchDailyActivityList(pageIndex,pageSize,searchTerm){
    //this.loader.present();
    await this.dailyActivityService.refreshDailyActivityList(pageIndex,pageSize,searchTerm);
    
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
