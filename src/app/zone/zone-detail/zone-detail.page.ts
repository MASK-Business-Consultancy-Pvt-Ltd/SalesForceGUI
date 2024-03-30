import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Zone } from '../zone.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { ZoneService } from '../zone.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';

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

  loadedZone:Zone = {};
  ViewDataFlag = false;
  public zoneForm! : FormGroup;


  constructor(private activatedRoute : ActivatedRoute,
    private zoneService: ZoneService,private router:Router, private _fb: FormBuilder,
    private alertCtrl : AlertController, private toastCtrl: ToastController,
    private loader: LoaderService) { }

  ngOnInit() {
    this.initZoneForm ();

    this.activatedRoute.paramMap.subscribe(paramMap=>{
       
      if(!paramMap.has('zoneId')){
        
        this.router.navigate(['/zone']);
        return;
      }

      if(paramMap.get('zoneId'))
      {
         const zoneId = JSON.parse(paramMap.get('zoneId')!);
         this.ViewDataFlag = true;
         this.loadZoneDetails(zoneId);
      }
      else
      {
         this.loadZoneDetails();
      }

    });

  }

  initZoneForm (){
    this.zoneForm = this._fb.group({
      id: [0],
      zoneCode: ['',Validators.required],
      zoneName: ['',Validators.required],
      active: ['',Validators.required]
    });
    this.zoneForm.controls['active'].setValue('Y');
  }

  enableFormControl(EditFlag){

    if(EditFlag == true)
    {
       this.zoneForm.get('zoneCode').enable();
       this.zoneForm.get('zoneName').enable();
       this.zoneForm.get('active').enable();
    }
    else
    {
       this.zoneForm.get('zoneCode').disable();
       this.zoneForm.get('zoneName').disable();
       this.zoneForm.get('active').disable();
    }
}

loadZoneDetails(zoneId=-1){
    
  if(zoneId == -1)
  {
  }
  else
  {

    this.zoneService.getZone(zoneId).pipe(catchError(error=>{
        
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
        
        if(data.responseData)
        {
            this.loadedZone = data.responseData[0];
            this.zoneForm.patchValue({
              id: this.loadedZone.id,
              zoneCode: this.loadedZone.zoneCode!,
              zoneName: this.loadedZone.zoneName!,
              active: this.loadedZone.active!

            })
        }

    })

    this.enableFormControl(false);
      
  }
}

ChangeViewDataFlag(){
    
  this.ViewDataFlag = false;
  this.enableFormControl(true);

}

DeleteZone(){

  const zoneId = this.loadedZone.id!;

    this.alertCtrl.create({
         header:'Are you sure?',
         message:'Do you really want to delete the Zone?',
         buttons:[{
            text:'Cancel',
            role:'cancel'

         },{
            text:'Delete',
            handler:() =>{

              this.loader.present();
              this.zoneService.deleteZone(zoneId).pipe(catchError(error=>{
                this.loader.dismiss();
                this.showToast('Some error has been occured','danger');
                return throwError(()=>error);
          
              })).subscribe(data=>{
                
                this.loader.dismiss();
                if(data.responseData)
                {
                  if(data.responseData.id == this.loadedZone.id && data.errCode == 0)
                  {
                      this.showToast('Zone Deleted Successfully','secondary');
                      this.zoneService.resetValues();
                      this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
                      this.router.navigate(['/zone']);
        
                  }
                }
                
          
              })

            }


         }
        ]

         }).then(alertElement =>{

            alertElement.present();
         })

}

onSubmit({value} : {value : Zone}){
  
  if(!value.id)
  {
     
     this.loader.present();
     this.zoneService.AddZone(value).pipe(catchError(error=>{

      this.loader.dismiss();
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

   })).subscribe(data=>{
     
     this.loader.dismiss();
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Zone Added Successfully','secondary');
             this.zoneService.resetValues();
             this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
             this.router.navigate(['/zone']);

       }

     }
   })
  }
  else
  {

   this.loader.present();
   this.zoneService.updateZone(value.id,value).pipe(catchError(error=>{
     this.loader.dismiss(); 
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
     
    this.loader.dismiss(); 
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Zone updated Successfully','secondary');
             this.zoneService.resetValues();
             this.fetchZoneList(this.zoneService.pageIndex, this.zoneService.pageSize, this.zoneService.searchTerm);
             this.router.navigate(['/zone']);

       }

     }

   })

  }

 
}

public async fetchZoneList(pageIndex,pageSize,searchTerm){

  //this.loader.present();

  await this.zoneService.refreshZoneList(pageIndex,pageSize,searchTerm);
  this.zoneService.pageIndex += 1;
  
}

async showToast(ToastMsg,colorType) {
  await this.toastCtrl.create({
    message: ToastMsg,
    duration: 2000,
    position: 'top',
    color:colorType,
    buttons: [{
      text: 'ok',
      handler: () => {
        //console.log("ok clicked");
      }
    }]
  }).then(res => res.present());
}



}


