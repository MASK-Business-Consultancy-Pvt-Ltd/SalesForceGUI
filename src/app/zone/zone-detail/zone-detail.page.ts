import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddTerritory, Territory } from '../zone.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ZoneService } from '../zone.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
import * as myGlobalVar from '../../global';

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.page.html',
  styleUrls: ['./zone-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
})
export class ZoneDetailPage implements OnInit {

  loadedZone: Territory;
  ViewDataFlag = false;
  public zoneForm = new FormGroup({
    territoryId: new FormControl(0),
    description: new FormControl('',[Validators.required]),
    parent: new FormControl(0,[Validators.required]),
    inactive: new FormControl('N',[Validators.required]),
  });


  constructor(private activatedRoute: ActivatedRoute,
    private zoneService: ZoneService, private router: Router, private _fb: FormBuilder,
    private alertCtrl: AlertController, private toastCtrl: ToastController,
    private loader: LoaderService) { }

  ngOnInit() {
    this.zoneForm.patchValue({
      parent : myGlobalVar.parentIdForZone
    })
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('zoneId')) {

        this.router.navigate(['/zone']);
        return;
      }

      if (paramMap.get('zoneId')) {
        const zoneId = JSON.parse(paramMap.get('zoneId')!);
        this.ViewDataFlag = true;
        this.zoneForm.patchValue({
          territoryId : zoneId
        })
        this.loadZoneDetails(zoneId);
      }
      else {
        this.loadZoneDetails();
      }

    });

  }


  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.zoneForm.get('description').enable();
      this.zoneForm.get('inactive').enable();
    }
    else {
      this.zoneForm.get('description').disable();
      this.zoneForm.get('inactive').disable();
    }
  }

  loadZoneDetails(zoneId?:number) {

    if (zoneId) {
    
      this.zoneService.getZone(zoneId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedZone = data.responseData[0];
          this.zoneForm.patchValue({
            description: this.loadedZone.description,
            parent: this.loadedZone.parent,
            inactive: this.loadedZone.inactive

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

  // DeleteZone() {

  //   const zoneId = this.loadedZone.id!;

  //   this.alertCtrl.create({
  //     header: 'Are you sure?',
  //     message: 'Do you really want to delete the Zone?',
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel'

  //     }, {
  //       text: 'Delete',
  //       handler: () => {

  //         this.loader.present();
  //         this.zoneService.deleteZone(zoneId).pipe(catchError(error => {
  //           this.loader.dismiss();
  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {

  //           this.loader.dismiss();
  //           if (data.responseData) {
  //             if (data.responseData[0].territoryId == this.loadedZone.id && data.errCode == 0) {
  //               this.showToast('Zone Deleted Successfully', 'secondary');
  //               this.zoneService.resetValues();
  //               this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
  //               this.router.navigate(['/zone']);

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

    let value = {...this.zoneForm.value}
    if (!value.territoryId) {

      this.loader.present();
      this.zoneService.AddZone(value as AddTerritory).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        this.loader.dismiss();

        if (data.errCode == 0) {
          this.showToast('Zone Added Successfully', 'secondary');
          this.zoneService.resetValues();
          //this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
          this.router.navigate(['/zone']);

        }

      })
    }
    else {

      this.loader.present();
      this.zoneService.updateZone(value.territoryId, value as AddTerritory).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        this.loader.dismiss();

        if (data.errCode == 0) {
          this.showToast('Zone updated Successfully', 'secondary');
          this.zoneService.resetValues();
          //this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
          this.router.navigate(['/zone']);

        }


      })

    }


  }

  public async fetchZoneList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();

    await this.zoneService.refreshZoneList(pageIndex, pageSize, searchTerm, myGlobalVar.TypeCodeZone);
    this.zoneService.pageIndex += 1;

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


