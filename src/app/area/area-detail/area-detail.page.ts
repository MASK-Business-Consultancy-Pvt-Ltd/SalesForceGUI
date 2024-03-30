import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Area } from '../area.model';
import { AreaService } from '../area.service';
import { catchError, throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';

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

  loadedArea:Area = {};
  ViewDataFlag=false;
  public areaForm! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
    public areaService: AreaService,private router:Router, private _fb: FormBuilder,
    private alertCtrl : AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initAreaForm();

    this.activatedRoute.paramMap.subscribe(paramMap=>{
       
      if(!paramMap.has('areaId')){
        
        this.router.navigate(['/area']);
        return;
      }

      if(paramMap.get('areaId'))
      {
         const areaId = JSON.parse(paramMap.get('areaId')!);
         this.ViewDataFlag = true;
         this.loadAreaDetails(areaId);
      }
      else
      {
         this.loadAreaDetails();
      }

    });

  }

  initAreaForm() {
    
    this.areaForm = this._fb.group({
        id: [0],
        areaCode: ['',Validators.required],
        areaName: ['',Validators.required],
        regionId: ['',Validators.required],
        active: ['',Validators.required],
    });
    this.areaForm.controls['active'].setValue('Y');
    this.areaService.getRegionList();
  }

  enableFormControl(EditFlag){

    if(EditFlag == true)
    {
      this.areaForm.get('areaCode').enable();
       this.areaForm.get('areaName').enable();
       this.areaForm.get('regionId').enable();
       this.areaForm.get('active').enable();
 
    }
    else
    {
      this.areaForm.get('areaCode').disable();
       this.areaForm.get('areaName').disable();
       this.areaForm.get('regionId').disable();
       this.areaForm.get('active').disable();
    }
}

loadAreaDetails(areaId=-1){
    
  if(areaId == -1)
  {
  }
  else
  {

    this.areaService.getArea(areaId).pipe(catchError(error=>{
        
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
        
        if(data.responseData)
        {
            this.loadedArea = data.responseData[0];
            this.areaForm.patchValue({
              id: this.loadedArea.id,
              areaCode: this.loadedArea.areaCode!,
              areaName: this.loadedArea.areaName!,
              regionId: this.loadedArea.regionId!,
              active: this.loadedArea.active!,

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


DeleteArea(){
      

  const areaId = this.loadedArea.id!;

    this.alertCtrl.create({
         header:'Are you sure?',
         message:'Do you really want to delete the Area?',
         buttons:[{
            text:'Cancel',
            role:'cancel'

         },{
            text:'Delete',
            handler:() =>{

              this.loader.present();
              this.areaService.deleteArea(areaId).pipe(catchError(error=>{
                this.loader.dismiss();
      
                this.showToast('Some error has been occured','danger');
                return throwError(()=>error);
          
              })).subscribe(data=>{
                this.loader.dismiss();
                
                if(data.responseData)
                {
                  if(data.responseData.id == this.loadedArea.id && data.errCode == 0)
                  {
                      this.showToast('Area Deleted Successfully','secondary');
                      this.areaService.resetValues();
                      this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
                      this.router.navigate(['/area']);
        
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

onSubmit({value} : {value : Area}){
  
  if(!value.id)
  {
    this.loader.present();
     this.areaService.AddArea(value).pipe(catchError(error=>{

      this.loader.dismiss();
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Area Added Successfully','secondary');
             this.areaService.resetValues();
             this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
             this.router.navigate(['/area']);

       }

     }
   })
  }
  else
  {

   this.areaService.updateArea(value.id,value).pipe(catchError(error=>{
         
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
     
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Area updated Successfully','secondary');
             this.areaService.resetValues();
             this.fetchAreaList(this.areaService.pageIndex, this.areaService.pageSize, this.areaService.searchTerm);
             this.router.navigate(['/area']);

       }

     }

   })

  }

 
}

public async fetchAreaList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.areaService.refreshAreaList(pageIndex,pageSize,searchTerm);
  this.areaService.pageIndex += 1;
    
  
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
