import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollCustomEvent, IonicModule, ToastController } from '@ionic/angular';
import { EmployeeService } from './employee.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink, 
    NgFor,
    NgIf,
    FormsModule
],
})
export class EmployeePage implements OnInit {

  constructor(public employeeService : EmployeeService, private toastCtrl:ToastController) { }

  ngOnInit() {

    this.employeeService.searchTerm = "";
    this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
    this.employeeService.pageIndex += 1;

  }
  
  public async fetchEmployeeList(pageIndex,pageSize,searchTerm){

    //this.loader.present();
    
    await this.employeeService.refreshEmployeeList(pageIndex,pageSize,searchTerm);

  }


  public async onScrollLoadData(ev){
    
    if(this.employeeService.employeeList.length !== this.employeeService.totalCount){

       this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
       this.employeeService.pageIndex += 1;

    }
    
     setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);

  }

      // ---------------For SeachBar---------------
      toggleSearchBar() {
        this.employeeService.showSearchBar = !this.employeeService.showSearchBar;
      }
      
      public async cancelSearch() {
        this.employeeService.showSearchBar = false;
        this.employeeService.searchTerm = "";
        this.employeeService.pageIndex = 1;
        this.employeeService.employeeList = [];
        await this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
        this.employeeService.pageIndex+=1;
      }

    public async search(searchTerm){
        this.employeeService.pageIndex=1;
        this.employeeService.employeeList = [];
        await this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
        this.employeeService.pageIndex+=1;

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
