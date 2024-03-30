import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-head-quarter-detail',
  templateUrl: './head-quarter-detail.page.html',
  styleUrls: ['./head-quarter-detail.page.scss'],
  standalone: true,
  imports: [
      IonicModule,
      RouterLink,
      NgFor,
      NgIf,
      ReactiveFormsModule
      
  ],
})
export class HeadQuarterDetailPage implements OnInit {

  ViewDataFlag=false;
  public headQuarterForm! : FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.initAreaForm();

  }

  initAreaForm() {
    
    this.headQuarterForm = this._fb.group({
        id: [0],
        headqQuarterName: ['',Validators.required],
        headQuarterId: ['0',Validators.required],
    });
  }

  enableFormControl(EditFlag){

    if(EditFlag == true)
    {
       this.headQuarterForm.get('headqQuarterName').enable();
       this.headQuarterForm.get('headQuarterId').enable();

    }
    else
    {
       this.headQuarterForm.get('headqQuarterName').disable();
       this.headQuarterForm.get('headQuarterId').disable();
    }
}


}
