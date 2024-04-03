import { TerritoryService } from './../territory.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
import { Territory } from 'src/app/zone/zone.model';

@Component({
  selector: 'app-territory-detail',
  templateUrl: './territory-detail.page.html',
  styleUrls: ['./territory-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class TerritoryDetailPage implements OnInit {

  loadedTerritory: Territory;
  ViewDataFlag = false;
  public territoryForm = new FormGroup({
    territoryId: new FormControl(0),
    description: new FormControl('', [Validators.required]),
    parent: new FormControl(0, [Validators.required]),
    inactive: new FormControl('N', [Validators.required]),
  });

  constructor(private activatedRoute: ActivatedRoute,
    public territoryService: TerritoryService, private router: Router, private _fb: FormBuilder,
    private alertCtrl: AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.territoryService.getAreaList()
    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('territoryId')) {

        this.router.navigate(['/territory']);
        return;
      }

      if (paramMap.get('territoryId')) {
        const territoryId = JSON.parse(paramMap.get('territoryId')!);
        this.ViewDataFlag = true;
        this.territoryForm.patchValue({
          territoryId : territoryId
        })
        this.loadTerritoryDetails(territoryId);
      }
      else {
        this.loadTerritoryDetails();
      }

    });
    this.territoryForm.patchValue({
      inactive : 'N'
    })
  }



  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.territoryForm.get('description').enable();
      this.territoryForm.get('parent').enable();
      this.territoryForm.get('inactive').enable();

    }
    else {
      this.territoryForm.get('description').disable();
      this.territoryForm.get('parent').disable();
      this.territoryForm.get('inactive').disable();
    }
  }

  loadTerritoryDetails(territoryId?:number) {

    if (territoryId) {
      this.territoryService.getTerritory(territoryId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedTerritory = data.responseData[0];
          this.territoryForm.patchValue({
            description: this.loadedTerritory.description,
            parent: this.loadedTerritory.parent,
            inactive: this.loadedTerritory.inactive

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

  // DeleteTerritory() {


  //   const territoryId = this.loadedTerritory.id!;

  //   this.alertCtrl.create({
  //     header: 'Are you sure?',
  //     message: 'Do you really want to delete the Territory?',
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel'

  //     }, {
  //       text: 'Delete',
  //       handler: () => {

  //         this.loader.present();
  //         this.territoryService.deleteTerritory(territoryId).pipe(catchError(error => {

  //           this.loader.dismiss();
  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {
  //           this.loader.dismiss();

  //           if (data.responseData) {
  //             if (data.responseData.id == this.loadedTerritory.id && data.errCode == 0) {
  //               this.showToast('Territory Deleted Successfully', 'secondary');
  //               this.territoryService.resetValues();
  //               this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
  //               this.router.navigate(['/territory']);

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

    let value = {...this.territoryForm.value}
    if (!value.territoryId) {
      this.loader.present();
      this.territoryService.AddTerritory(value as Territory).pipe(catchError(error => {

        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();

          if (data.errCode == 0) {
            this.showToast('Territory Added Successfully', 'secondary');
            this.territoryService.resetValues();
            //this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
            this.router.navigate(['/territory']);
          }
      })
    }
    else {

      this.loader.present();
      this.territoryService.updateTerritory(value.territoryId, value as Territory).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();

          if (data.errCode == 0) {
            this.showToast('Territory updated Successfully', 'secondary');
            this.territoryService.resetValues();
            //this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
            this.router.navigate(['/territory']);
          }
      })

    }


  }

  public async fetchTerritoryList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.territoryService.refreshTerritoryList(pageIndex, pageSize, searchTerm);
    this.territoryService.pageIndex += 1;

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
