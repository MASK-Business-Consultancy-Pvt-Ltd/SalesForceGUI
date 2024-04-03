import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { AreaService } from '../area.service';
import { catchError, throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
import { Territory } from 'src/app/zone/zone.model';
import * as myGlobalVar from '../../global';


@Component({
  selector: 'app-area-detail',
  templateUrl: './area-detail.page.html',
  styleUrls: ['./area-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class AreaDetailPage implements OnInit {

  loadedArea: Territory;
  ViewDataFlag = false;
  public areaForm = new FormGroup({
    territoryId: new FormControl(0),
    description: new FormControl('', [Validators.required]),
    parent: new FormControl(0, [Validators.required]),
    inactive: new FormControl('N', [Validators.required]),
  });

  constructor(private activatedRoute: ActivatedRoute,
    public areaService: AreaService, private router: Router, private _fb: FormBuilder,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.areaService.getRegionList()
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('areaId')) {

        this.router.navigate(['/area']);
        return;
      }

      if (paramMap.get('areaId')) {
        const areaId = JSON.parse(paramMap.get('areaId')!);
        this.ViewDataFlag = true;
        this.areaForm.patchValue({
          territoryId : areaId
        })
        this.loadAreaDetails(areaId);
      }
      else {
        this.loadAreaDetails();
      }

    });

  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.areaForm.get('description').enable();
      this.areaForm.get('parent').enable();
      this.areaForm.get('inactive').enable();

    }
    else {
      this.areaForm.get('description').disable();
      this.areaForm.get('parent').disable();
      this.areaForm.get('inactive').disable();
    }
  }

  loadAreaDetails(areaId?:number) {

    if (areaId) {
      this.areaService.getArea(areaId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedArea = data.responseData[0];
          this.areaForm.patchValue({
            description: this.loadedArea.description,
            parent: this.loadedArea.parent,
            inactive: this.loadedArea.inactive

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


  // DeleteArea(){


  //   const areaId = this.loadedArea.id!;

  //     this.alertCtrl.create({
  //          header:'Are you sure?',
  //          message:'Do you really want to delete the Area?',
  //          buttons:[{
  //             text:'Cancel',
  //             role:'cancel'

  //          },{
  //             text:'Delete',
  //             handler:() =>{

  //               this.loader.present();
  //               this.areaService.deleteArea(areaId).pipe(catchError(error=>{
  //                 this.loader.dismiss();

  //                 this.showToast('Some error has been occured','danger');
  //                 return throwError(()=>error);

  //               })).subscribe(data=>{
  //                 this.loader.dismiss();

  //                 if(data.responseData)
  //                 {
  //                   if(data.responseData.id == this.loadedArea.id && data.errCode == 0)
  //                   {
  //                       this.showToast('Area Deleted Successfully','secondary');
  //                       this.areaService.resetValues();
  //                       this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
  //                       this.router.navigate(['/area']);

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
    let value = { ...this.areaForm.value }

    if (!value.territoryId) {
      this.loader.present();
      this.areaService.AddArea(value as Territory).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Area Added Successfully', 'secondary');
          this.areaService.resetValues();
          this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
          this.router.navigate(['/area']);

        }

      })
    }
    else {
      this.loader.present();
      this.areaService.updateArea(value.territoryId, value as Territory).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {



        if (data.errCode == 0) {
          this.loader.dismiss();
          this.showToast('Area updated Successfully', 'secondary');
          this.areaService.resetValues();
          this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
          this.router.navigate(['/area']);

        }


      })

    }


  }

  public async fetchAreaList(pageIndex, pageSize, searchTerm) {
    //this.loader.present();
    await this.areaService.refreshAreaList(pageIndex, pageSize, searchTerm,myGlobalVar.TypeCodeArea);
    this.areaService.pageIndex += 1;
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
