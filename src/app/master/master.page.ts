import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor 
  ],
})
export class MasterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
