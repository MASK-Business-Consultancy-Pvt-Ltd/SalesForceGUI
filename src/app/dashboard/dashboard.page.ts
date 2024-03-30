import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { Router, RouterLink } from '@angular/router';
import { CommonService } from '../common/common.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    standalone: true,
    imports: [IonicModule,RouterLink],
})
export class DashboardPage implements OnInit {

  constructor(private router:Router,public commonService:CommonService) { }

  ngOnInit() {
  }

  Logout(){

    localStorage.clear();
    this.router.navigate(['/']);

  }

}
