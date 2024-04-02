import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { EmployeeLevel } from '../level.model';
import { LevelService } from '../level.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.page.html',
  styleUrls: ['./level-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class LevelDetailPage implements OnInit {

  loadedLevel: EmployeeLevel;

  ViewDataFlag = false;
  levelForm = new FormGroup({
    positionID: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('',),
  });

  constructor(private activatedRoute: ActivatedRoute,
    private levelService: LevelService, private router: Router, private _fb: FormBuilder,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('levelId')) {

        this.router.navigate(['/level']);
        return;
      }

      if (paramMap.get('levelId')) {
        const levelId = JSON.parse(paramMap.get('levelId')!);
        this.ViewDataFlag = true;
        this.loadLevelDetails(levelId);
      }
      else {
        this.loadLevelDetails();
      }

    });


  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.levelForm.get('name').enable();
      this.levelForm.get('description').enable();
    }
    else {
      this.levelForm.get('name').disable();
      this.levelForm.get('description').disable();
    }
  }

  loadLevelDetails(levelId?: number) {

    if (levelId) {

      this.levelService.getLevel(levelId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedLevel = data.responseData[0];
          this.levelForm.patchValue({
            positionID: this.loadedLevel.positionID,
            name: this.loadedLevel.name,
            description: this.loadedLevel.description,

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

  // DeleteLevel(){

  //   const levelId = this.loadedLevel.id!;

  //     this.alertCtrl.create({
  //          header:'Are you sure?',
  //          message:'Do you really want to delete the Level?',
  //          buttons:[{
  //             text:'Cancel',
  //             role:'cancel'

  //          },{
  //             text:'Delete',
  //             handler:() =>{
  //               this.loader.present();

  //               this.levelService.deleteLevel(levelId).pipe(catchError(error=>{
  //                 this.loader.dismiss();

  //                 this.showToast('Some error has been occured','danger');
  //                 return throwError(()=>error);

  //               })).subscribe(data=>{
  //                 this.loader.dismiss();

  //                 if(data.responseData)
  //                 {
  //                   if(data.responseData.id == this.loadedLevel.id && data.errCode == 0)
  //                   {
  //                       this.showToast('Level Deleted Successfully','secondary');
  //                       this.levelService.resetValues();
  //                       this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
  //                       this.router.navigate(['/level']);

  //                   }
  //                 }

  //               })

  //             }
  //          }
  //         ]

  //          }).then(alertElement =>{

  //             alertElement.present();
  //          })

  // }

  onSubmit() {
    let value = { ...this.levelForm.value }
    if (!value.positionID) {
      this.loader.present();
      this.levelService.AddLevel(value).pipe(catchError(error => {
        this.loader.dismiss();

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();
        if (data.errCode == 0) {
          this.showToast('Level Added Successfully', 'secondary');
          this.levelService.resetValues();
          //this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
          this.router.navigate(['/level']);
        }
      })
    }
    else {

      this.loader.present();
      this.levelService.updateLevel(value.positionID, value).pipe(catchError(error => {
        this.loader.dismiss();

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();
        if (data.errCode == 0) {
          this.showToast('Level updated Successfully', 'secondary');
          this.levelService.resetValues();
          //this.fetchLevelList(this.levelService.pageIndex, this.levelService.pageSize, this.levelService.searchTerm);
          this.router.navigate(['/level']);
        }
      })
    }
  }

  public async fetchLevelList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.levelService.refreshLevelList(pageIndex, pageSize, searchTerm);
    this.levelService.pageIndex += 1;

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
