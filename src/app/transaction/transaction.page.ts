import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor 
  ],
})
export class TransactionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
