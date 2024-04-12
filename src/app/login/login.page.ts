import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from './login.model';
import { ToastController } from '@ionic/angular';
import { LoaderService } from '../common/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private loginService: LoginService,private toastCtrl: ToastController,private loader: LoaderService) { }

  ngOnInit() {

  }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    token : new FormControl('')
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loader.present()
      let loginData = this.loginForm.value;
      this.loginService.loginUser(loginData as Login).subscribe({
        next : (res) => {
          this.loader.dismiss()
        if(res.errCode == -1){
          
          this.showToast(res.message,'danger')
        }else if (res.errCode == 0){
          this.loader.dismiss()

          this.loginService.setToken(res.responseData[0].token)
          this.router.navigate(['/dashboard']);
        }
      },
      error: ()=>{
        this.loader.dismiss()
      }
    });
    } else {
      
    }
  }

  onPassSubmit() {
    this.router.navigate(['/']);
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
