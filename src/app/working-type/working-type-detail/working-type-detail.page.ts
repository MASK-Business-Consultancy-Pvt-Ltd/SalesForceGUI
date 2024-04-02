import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { WorkingTypeService } from '../working-type.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { WorkingType } from '../working-type.model';
import { LoaderService } from 'src/app/common/loader.service';
@Component({
  selector: 'app-working-type-detail',
  templateUrl: './working-type-detail.page.html',
  styleUrls: ['./working-type-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class WorkingTypeDetailPage implements OnInit {
  loadedWorkingType: WorkingType;
  ViewDataFlag = false;
  public workingTypeForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    u_active: new FormControl('', [Validators.required]),
  });
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private workingTypeService: WorkingTypeService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.workingTypeForm.patchValue({
      u_active: 'Y'
    })

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('WorkingTypeId')) {

        this.router.navigate(['/working-type']);
        return;
      }

      if (paramMap.get('WorkingTypeId')) {
        const workingTypecode = paramMap.get('WorkingTypeId');
        this.ViewDataFlag = true;
        this.loadWorkingTypeDetails(workingTypecode);
        this.workingTypeForm.get('code').disable();
      }
      else {
        this.loadWorkingTypeDetails();
      }

    });
  }




  enableFormControl(EditFlag) {

    if (EditFlag == true) {

      this.activatedRoute.paramMap.subscribe(paramMap => {

        if (!paramMap.has('WorkingTypeId')) {
          this.workingTypeForm.get('code').enable();
        }
      })

      this.workingTypeForm.get('name').enable();
      this.workingTypeForm.get('u_active').enable();
    }
    else {

      this.workingTypeForm.get('code').disable();
      this.workingTypeForm.get('name').disable();
      this.workingTypeForm.get('u_active').disable();

    }
  }

  loadWorkingTypeDetails(workingTypeCode?: string) {

    if (workingTypeCode) {

      this.workingTypeService.getWorkingType(workingTypeCode).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedWorkingType = data.responseData[0];
          this.workingTypeForm.patchValue({
            code: this.loadedWorkingType.code,
            name: this.loadedWorkingType.name,
            u_active: this.loadedWorkingType.u_Active,

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


    const workingTypeId = this.loadedWorkingType.code;

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
          this.workingTypeService.deleteWorkingType(workingTypeId).pipe(catchError(error => {
            this.loader.dismiss();
            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {
            this.loader.dismiss();

            if (data.responseData) {
              if (data.responseData[0].code == this.loadedWorkingType.code && data.errCode == 0) {
                this.showToast('Working Type Deleted Successfully', 'secondary');
                this.workingTypeService.resetValues();
                this.fetchProductTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
                this.router.navigate(['/working-type']);

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
    let value = { ...this.workingTypeForm.value }

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.get('WorkingTypeId') != '') {
        let workTypeCode = paramMap.get('WorkingTypeId')
        this.loader.present();
        this.workingTypeService.updateWorkingType(workTypeCode, value).pipe(catchError(error => {
          this.loader.dismiss();
          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);

        })).subscribe(data => {
          this.loader.dismiss();
          if (data.errCode == 0) {
            this.showToast('Product Type updated Successfully', 'secondary');
            this.workingTypeService.resetValues();
            //this.fetchProductTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
            this.router.navigate(['/working-type']);

          }
        })
      }
      else {
        this.loader.present();
        this.workingTypeService.AddWorkingType(value).pipe(catchError(error => {
          this.loader.dismiss();

          this.showToast('Some error has been occured', 'danger');
          return throwError(() => error);

        })).subscribe(data => {
          this.loader.dismiss();

          if (data.errCode == 0) {
            this.showToast('Working Type Added Successfully', 'secondary');
            this.workingTypeService.resetValues();
            //this.fetchProductTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
            this.router.navigate(['/working-type']);
          }
        })
      }
    })
  }

  public async fetchProductTypeList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.workingTypeService.refreshworkingTypeList(pageIndex, pageSize, searchTerm);


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
