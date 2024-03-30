import { TerritoryService } from './../territory.service';
import { Territory } from './../territory.model';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';

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

  loadedTerritory:Territory = {};
  ViewDataFlag=false;
  public territoryForm! : FormGroup;

  constructor(private activatedRoute : ActivatedRoute,
    public territoryService: TerritoryService,private router:Router, private _fb: FormBuilder,
    private alertCtrl : AlertController, private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initregionForm();

    this.activatedRoute.paramMap.subscribe(paramMap=>{
       
      if(!paramMap.has('territoryId')){
        
        this.router.navigate(['/territory']);
        return;
      }

      if(paramMap.get('territoryId'))
      {
         const territoryId = JSON.parse(paramMap.get('territoryId')!);
         this.ViewDataFlag = true;
         this.loadTerritoryDetails(territoryId);
      }
      else
      {
         this.loadTerritoryDetails();
      }

    });
  }

  initregionForm() {
    
    this.territoryForm = this._fb.group({
        id: [0],
       //  territoryCode: ['',Validators.required],
        territoryName: ['',Validators.required],
        areaId: ['',Validators.required],
        active: ['',Validators.required],
    });
    this.territoryForm.controls['active'].setValue('Y');
    this.territoryService.getAreaList();
  }

  enableFormControl(EditFlag){

    if(EditFlag == true)
    {
     //  this.territoryForm.get('territoryCode').enable();
       this.territoryForm.get('territoryName').enable();
       this.territoryForm.get('areaId').enable();
       this.territoryForm.get('active').enable();

    }
    else
    {
     //  this.territoryForm.get('territoryCode').disable();
       this.territoryForm.get('territoryName').disable();
       this.territoryForm.get('areaId').disable();
       this.territoryForm.get('active').disable();
    }
}

loadTerritoryDetails(territoryId=-1){
    
  if(territoryId == -1)
  {
  }
  else
  {

    this.territoryService.getTerritory(territoryId).pipe(catchError(error=>{
        
      this.showToast('Some error has been occured','danger');
      return throwError(()=>error);

    })).subscribe(data=>{
        
        if(data.responseData)
        {
            this.loadedTerritory = data.responseData[0];
            this.territoryForm.patchValue({
              id: this.loadedTerritory.id,
             // territoryCode: this.loadedTerritory.territoryCode!,
              territoryName: this.loadedTerritory.territoryName!,
              areaId: this.loadedTerritory.areaId!,
              active: this.loadedTerritory.active!,

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

DeleteTerritory(){
      

  const territoryId = this.loadedTerritory.id!;

    this.alertCtrl.create({
         header:'Are you sure?',
         message:'Do you really want to delete the Territory?',
         buttons:[{
            text:'Cancel',
            role:'cancel'

         },{
            text:'Delete',
            handler:() =>{

              this.loader.present();
              this.territoryService.deleteTerritory(territoryId).pipe(catchError(error=>{
      
                this.loader.dismiss();
                this.showToast('Some error has been occured','danger');
                return throwError(()=>error);
          
              })).subscribe(data=>{
                this.loader.dismiss();
                
                if(data.responseData)
                {
                  if(data.responseData.id == this.loadedTerritory.id && data.errCode == 0)
                  {
                      this.showToast('Territory Deleted Successfully','secondary');
                      this.territoryService.resetValues();
                      this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
                      this.router.navigate(['/territory']);
        
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

onSubmit({value} : {value : Territory}){
  
  if(!value.id)
  {
    this.loader.present();
     this.territoryService.AddTerritory(value).pipe(catchError(error=>{

      this.loader.dismiss();
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Territory Added Successfully','secondary');
             this.territoryService.resetValues();
             this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
             this.router.navigate(['/territory']);

       }

     }
   })
  }
  else
  {

    this.loader.present();
   this.territoryService.updateTerritory(value.id,value).pipe(catchError(error=>{
    this.loader.dismiss();  
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Territory updated Successfully','secondary');
             this.territoryService.resetValues();
             this.fetchTerritoryList(this.territoryService.pageIndex, this.territoryService.pageSize, this.territoryService.searchTerm);
             this.router.navigate(['/territory']);

       }

     }

   })

  }

 
}

public async fetchTerritoryList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.territoryService.refreshTerritoryList(pageIndex,pageSize,searchTerm);
  this.territoryService.pageIndex += 1;
  
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
