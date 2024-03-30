import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {

  }

  onSubmit(){
    

    localStorage.setItem('UserId','abc');
    this.router.navigate(['/dashboard']);
  }

  onPassSubmit(){
    localStorage.setItem('UserId','abc');
    this.router.navigate(['/']);
  }

}
