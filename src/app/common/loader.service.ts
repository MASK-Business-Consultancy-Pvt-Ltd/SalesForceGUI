import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = false;

  constructor(public loadingController : LoadingController) { }
  
   present(){

    this.isLoading = true;

    return this.loadingController.create({
      message:'Please Wait..',
      spinner:'circles'

    }).then(x=> {

       x.present().then(()=>{
         console.log('presented');

         if(!this.isLoading)
         {
            x.dismiss().then(()=>  console.log('abort presenting'));

         }

       })
    })


  }

   dismiss() {
    this.isLoading = false;
    return this.loadingController.dismiss().then(() => console.log('dismissed'));
  }


}
