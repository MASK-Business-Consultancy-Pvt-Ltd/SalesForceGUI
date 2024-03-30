import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-head-quarter',
  templateUrl: './head-quarter.page.html',
  styleUrls: ['./head-quarter.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor
      
  ],
})
export class HeadQuarterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
