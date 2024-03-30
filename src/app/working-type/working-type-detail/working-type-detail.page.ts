import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  loadedWorkingType: WorkingType = {};
  ViewDataFlag = false;
  public workingTypeForm!: FormGroup;
  constructor(private _fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private workingTypeService: WorkingTypeService, private router: Router, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initWorkingTypeForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('WorkingTypeId')) {

        this.router.navigate(['/working-type']);
        return;
      }

      if (paramMap.get('WorkingTypeId')) {
        const productTypeId = JSON.parse(paramMap.get('WorkingTypeId')!);
        this.ViewDataFlag = true;
        this.loadProductTypeDetails(productTypeId);
      }
      else {
        this.loadProductTypeDetails();
      }

    });
  }


  initWorkingTypeForm() {

    this.workingTypeForm = this._fb.group({
      id: [0],
     typeCode: ['', Validators.required],
      typeName: ['', Validators.required],
      active: ['', Validators.required],
    });
    this.workingTypeForm.controls['active'].setValue('Y');
  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {
     
      this.workingTypeForm.get('typeCode').enable();
      this.workingTypeForm.get('typeName').enable();
      this.workingTypeForm.get('active').enable();
    }
    else {
    
      this.workingTypeForm.get('typeCode').disable();
      this.workingTypeForm.get('typeName').disable();
      this.workingTypeForm.get('active').disable();

    } 
  }

  loadProductTypeDetails(prodTypeId = -1) {

    if (prodTypeId == -1) {
    }
    else {

      this.workingTypeService.getWorkingType(prodTypeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedWorkingType = data.responseData[0];
          this.workingTypeForm.patchValue({
            id: this.loadedWorkingType.id,
            typeCode: this.loadedWorkingType.typeCode!,
            typeName: this.loadedWorkingType.typeName!,
            active: this.loadedWorkingType.active!,

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


    const workingTypeId = this.loadedWorkingType.id!;

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
              if (data.responseData.id == this.loadedWorkingType.id && data.errCode == 0) {
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


  onSubmit({ value }: { value: WorkingType }) {
    
    if (!value.id) {
      this.loader.present();
      this.workingTypeService.AddWorkingType(value).pipe(catchError(error => {
        this.loader.dismiss(); 

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Working Type Added Successfully', 'secondary');
            this.workingTypeService.resetValues();
                this.fetchProductTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
            this.router.navigate(['/working-type']);

          }

        }
      })
    }
    else {

      this.loader.present();
      this.workingTypeService.updateWorkingType(value.id, value).pipe(catchError(error => {
        this.loader.dismiss(); 
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss(); 

        if (data.responseData) {
          if (data.responseData.id && data.errCode == 0) {
            this.showToast('Product Type updated Successfully', 'secondary');
            this.workingTypeService.resetValues();
                this.fetchProductTypeList(this.workingTypeService.pageIndex, this.workingTypeService.pageSize, this.workingTypeService.searchTerm);
            this.router.navigate(['/working-type']);

          }

        }

      })

    }


  }

  public async fetchProductTypeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
  
    await this.workingTypeService.refreshworkingTypeList(pageIndex,pageSize,searchTerm);
      
    
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
