import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { RegionService } from '../region.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Territory, TerritoryResponse } from 'src/app/zone/zone.model';
import { ZoneService } from 'src/app/zone/zone.service';
import { LoaderService } from 'src/app/common/loader.service';
import * as myGlobalVar from '../../global';


@Component({
  selector: 'app-region-detail',
  templateUrl: './region-detail.page.html',
  styleUrls: ['./region-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class RegionDetailPage implements OnInit {

  loadedRegion: Territory;

  ViewDataFlag = false;
  public regionForm = new FormGroup({
    territoryId: new FormControl(0),
    description: new FormControl('', [Validators.required]),
    parent: new FormControl(0, [Validators.required]),
    inactive: new FormControl('N', [Validators.required]),
  });

  constructor(private activatedRoute: ActivatedRoute,
    public regionService: RegionService, private router: Router, private _fb: FormBuilder,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('regionId')) {

        this.router.navigate(['/region']);
        return;
      }

      if (paramMap.get('regionId')) {
        const regionId = JSON.parse(paramMap.get('regionId')!);
        this.ViewDataFlag = true;
        this.regionForm.patchValue({
          territoryId : regionId
        })
        this.loadRegionDetails(regionId);
      }
      else {
        this.loadRegionDetails();
      }

    });
    this.regionService.getZoneList()
    
  }

  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      // this.regionForm.get('regionCode').enable();
      this.regionForm.get('description').enable();
      this.regionForm.get('parent').enable();
      this.regionForm.get('inactive').enable();

    }
    else {
      // this.regionForm.get('regionCode').disable();
      this.regionForm.get('description').disable();
      this.regionForm.get('parent').disable();
      this.regionForm.get('inactive').disable();
    }
  }

  loadRegionDetails(regionId?:number) {

    if (regionId) {
      this.regionService.getRegion(regionId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedRegion = data.responseData[0];
          this.regionForm.patchValue({
            description: this.loadedRegion.description,
            parent: this.loadedRegion.parent,
            inactive: this.loadedRegion.inactive
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

  DeleteRegion() {


    const regionId = this.loadedRegion.territoryId;

    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete the Reigon?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'

      }, {
        text: 'Delete',
        handler: () => {

          this.loader.present();
          this.regionService.deleteRegion(regionId).pipe(catchError(error => {
            this.loader.dismiss();

            this.showToast('Some error has been occured', 'danger');
            return throwError(() => error);

          })).subscribe(data => {

            this.loader.dismiss();
            if (data.responseData) {
              if (data.responseData[0].territoryId == this.loadedRegion.territoryId && data.errCode == 0) {
                this.showToast('Region Deleted Successfully', 'secondary');
                this.regionService.resetValues();
                this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
                this.router.navigate(['/region']);

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
    let value = {...this.regionForm.value}
    if (!value.territoryId) {
      this.loader.present();
      this.regionService.AddRegion(value as Territory).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        this.loader.dismiss();

        if (data.errCode == 0) {
          this.showToast('Region Added Successfully', 'secondary');
          this.regionService.resetValues();
          //this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
          this.router.navigate(['/region']);

        }

      })
    }
    else {

      this.loader.present();
      this.regionService.updateRegion(value.territoryId, value as Territory).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Region updated Successfully', 'secondary');
          this.regionService.resetValues();
          //this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
          this.router.navigate(['/region']);

        }


      })

    }


  }

  public async fetchRegionList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.regionService.refreshRegionList(pageIndex, pageSize, searchTerm, myGlobalVar.TypeCodeRegion);
    this.regionService.pageIndex += 1;


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
