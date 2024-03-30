import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Region } from '../region.model';
import { RegionService } from '../region.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Zone } from 'src/app/zone/zone.model';
import { ZoneService } from 'src/app/zone/zone.service';
import { LoaderService } from 'src/app/common/loader.service';

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

  loadedRegion:Region = {};
 
  ViewDataFlag=false;
  public regionForm! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
    public regionService: RegionService,private router:Router, private _fb: FormBuilder,
    private alertCtrl : AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {

    this.initregionForm();



    this.activatedRoute.paramMap.subscribe(paramMap=>{
       
      if(!paramMap.has('regionId')){
        
        this.router.navigate(['/region']);
        return;
      }

      if(paramMap.get('regionId'))
      {
         const regionId = JSON.parse(paramMap.get('regionId')!);
         this.ViewDataFlag = true;
         this.loadRegionDetails(regionId);
      }
      else
      {
         this.loadRegionDetails();
      }

    });

  }

  initregionForm() {
    
    this.regionForm = this._fb.group({
        id: [0],
        // regionCode: ['',Validators.required],
        regionName: ['',Validators.required],
        zoneId: ['',Validators.required],
        active: ['',Validators.required]

    });
  
    this.regionForm.controls['active'].setValue('Y');
    this.regionService.getZoneList();

  }

  enableFormControl(EditFlag){ 

    if(EditFlag == true)
    { 
      // this.regionForm.get('regionCode').enable();
       this.regionForm.get('regionName').enable();
       this.regionForm.get('zoneId').enable();
       this.regionForm.get('active').enable();

    }
    else
    {
      // this.regionForm.get('regionCode').disable();
       this.regionForm.get('regionName').disable();
       this.regionForm.get('zoneId').disable();
       this.regionForm.get('active').disable();
    }
}

loadRegionDetails(regionId=-1){
    
  if(regionId == -1)
  {
  }
  else
  {

    this.regionService.getRegion(regionId).pipe(catchError(error=>{
        
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
        
        if(data.responseData)
        {
            this.loadedRegion = data.responseData[0];
            this.regionForm.patchValue({
              id: this.loadedRegion.id,
           //   regionCode: this.loadedRegion.regionCode!,
              regionName: this.loadedRegion.regionName!,
              zoneId:this.loadedRegion.zoneId!,
              active: this.loadedRegion.active!

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

DeleteRegion(){
      

  const regionId = this.loadedRegion.id!;

    this.alertCtrl.create({
         header:'Are you sure?',
         message:'Do you really want to delete the Reigon?',
         buttons:[{
            text:'Cancel',
            role:'cancel'

         },{
            text:'Delete',
            handler:() =>{

              this.loader.present();
              this.regionService.deleteRegion(regionId).pipe(catchError(error=>{
                this.loader.dismiss();
      
                this.showToast('Some error has been occured','danger');
                return throwError(()=>error);
          
              })).subscribe(data=>{
                
                this.loader.dismiss();
                if(data.responseData)
                {
                  if(data.responseData.id == this.loadedRegion.id && data.errCode == 0)
                  {
                      this.showToast('Region Deleted Successfully','secondary');
                      this.regionService.resetValues();
                      this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
                      this.router.navigate(['/region']);
        
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

onSubmit({value} : {value : Region}){
  
  if(!value.id)
  {
    this.loader.present();
     this.regionService.AddRegion(value).pipe(catchError(error=>{

      this.loader.dismiss();
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
     
    this.loader.dismiss();
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Region Added Successfully','secondary');
             this.regionService.resetValues();
             this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
             this.router.navigate(['/region']);

       }

     }
   })
  }
  else
  {

    this.loader.present();
   this.regionService.updateRegion(value.id,value).pipe(catchError(error=>{
    this.loader.dismiss();    
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Region updated Successfully','secondary');
             this.regionService.resetValues();
             this.fetchRegionList(this.regionService.pageIndex, this.regionService.pageSize, this.regionService.searchTerm);
             this.router.navigate(['/region']);

       }

     }

   })

  }

 
}

public async fetchRegionList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.regionService.refreshRegionList(pageIndex,pageSize,searchTerm);
  this.regionService.pageIndex += 1;
    
  
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
