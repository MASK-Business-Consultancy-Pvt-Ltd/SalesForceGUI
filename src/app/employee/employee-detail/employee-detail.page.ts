import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.page.html',
  styleUrls: ['./employee-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    NgFor,
    NgIf,
    ReactiveFormsModule

  ],
})
export class EmployeeDetailPage implements OnInit {

  loadedEmployee: Employee = {};
  ViewDataFlag = false;
  public employeeForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    public employeeService: EmployeeService, private router: Router,
    private _fb: FormBuilder, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private loader: LoaderService) { }

  ngOnInit() {
    this.initemployeeForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('employeeId')) {

        this.router.navigate(['/employee']);
        return;
      }

      if (paramMap.get('employeeId')) {
        const employeeId = JSON.parse(paramMap.get('employeeId')!);
        this.ViewDataFlag = true;
        this.loadEmployeeDetails(employeeId);
      }
      else {
        this.loadEmployeeDetails();
      }

    });



  }

  initemployeeForm() {

    this.employeeForm = this._fb.group({
      id: [0],
      employeeCode: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      levelID: ['', Validators.required],
      reportingManagerId: ['', Validators.required],
      contactNo: ['', Validators.required],
      building: ['', Validators.required],
      block: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      active: ['', Validators.required],
      emailId: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      territoryID: ['', Validators.required],
    });

    this.employeeService.getLevelList();
    this.employeeService.getTerritoryList();
    this.employeeService.getEmployeeList();
    this.employeeForm.controls['active'].setValue('Y');
  }

  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.employeeForm.get('employeeCode').enable();
      this.employeeForm.get('firstname').enable();
      this.employeeForm.get('lastname').enable();
      this.employeeForm.get('levelID').enable();
      this.employeeForm.get('reportingManagerId').enable();
      this.employeeForm.get('contactNo').enable();
      this.employeeForm.get('building').enable();
      this.employeeForm.get('block').enable();
      this.employeeForm.get('city').enable();
      this.employeeForm.get('zipcode').enable();
      this.employeeForm.get('state').enable();
      this.employeeForm.get('country').enable();
      this.employeeForm.get('active').enable();
      this.employeeForm.get('emailId').enable();
      this.employeeForm.get('login').enable();
      this.employeeForm.get('password').enable();
      this.employeeForm.get('territoryID').enable();
    }
    else {
      this.employeeForm.get('employeeCode').disable();
      this.employeeForm.get('firstname').disable();
      this.employeeForm.get('lastname').disable();
      this.employeeForm.get('levelID').disable();
      this.employeeForm.get('reportingManagerId').disable();
      this.employeeForm.get('contactNo').disable();
      this.employeeForm.get('building').disable();
      this.employeeForm.get('block').disable();
      this.employeeForm.get('city').disable();
      this.employeeForm.get('zipcode').disable();
      this.employeeForm.get('state').disable();
      this.employeeForm.get('country').disable();
      this.employeeForm.get('active').disable();
      this.employeeForm.get('emailId').disable();
      this.employeeForm.get('login').disable();
      this.employeeForm.get('password').disable();
      this.employeeForm.get('territoryID').disable();

    }
  }

  loadEmployeeDetails(employeeId = -1) {

    if (employeeId == -1) {
    }
    else {

      this.employeeService.getEmployee(employeeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        
        if (data.responseData) {
          this.loadedEmployee = data.responseData[0];
          this.employeeForm.patchValue({
            id: this.loadedEmployee.id,
            employeeCode: this.loadedEmployee.employeeCode!,
            firstname:this.loadedEmployee.firstName!,
            lastname:this.loadedEmployee.lastName!,
            levelID: this.loadedEmployee.levelID!,
            reportingManagerId: this.loadedEmployee.reportingManagerId!,
            contactNo: this.loadedEmployee.contactNo!,
            building: this.loadedEmployee.building!,
            block:this.loadedEmployee.block!,
            city:this.loadedEmployee.city!,
            zipcode:this.loadedEmployee.zipcode!,
            state:this.loadedEmployee.state!,
            country:this.loadedEmployee.country!,
            active: this.loadedEmployee.active!,
            emailId: this.loadedEmployee.emailId!,
            login: this.loadedEmployee.login!,
            password: this.loadedEmployee.password!,
            territoryID: this.loadedEmployee.territoryID!,
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

  DeleteEmployee(){
      

    const employeeId = this.loadedEmployee.id!;

      this.alertCtrl.create({
           header:'Are you sure?',
           message:'Do you really want to delete the Employee?',
           buttons:[{
              text:'Cancel',
              role:'cancel'

           },{
              text:'Delete',
              handler:() =>{

                this.loader.present();
                this.employeeService.deleteEmployee(employeeId).pipe(catchError(error=>{
                  this.loader.dismiss();
        
                  this.showToast('Some error has been occured','danger');
                  return throwError(()=>error);
            
                })).subscribe(data=>{
                  this.loader.dismiss();
                  
                  if(data.responseData)
                  {
                    if(data.responseData.id == this.loadedEmployee.id && data.errCode == 0)
                    {
                        this.showToast('Employee Deleted Successfully','secondary');
                        this.employeeService.resetValues();
                        this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
                        this.router.navigate(['/employee']);
          
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

onSubmit({value} : {value : Employee}){
  
  if(!value.id)
  {
    this.loader.present();
     this.employeeService.AddEmployee(value).pipe(catchError(error=>{
      this.loader.dismiss();

     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss();
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Employee Added Successfully','secondary');
             this.employeeService.resetValues();
             this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);;
             this.router.navigate(['/employee']);

       }

     }
   })
  }
  else
  {

    this.loader.present();
   this.employeeService.updateEmployee(value.id,value).pipe(catchError(error=>{
    this.loader.dismiss(); 
     this.showToast('Some error has been occured','danger');
     return throwError(()=>error);

   })).subscribe(data=>{
    this.loader.dismiss(); 
     
     if(data.responseData)
     {
       if(data.responseData.id && data.errCode == 0)
       {
             this.showToast('Employee updated Successfully','secondary');
             this.employeeService.resetValues();
             this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
             this.router.navigate(['/employee']);

       }

     }

   })

  }

 
}

public async fetchEmployeeList(pageIndex,pageSize,searchTerm){

  //this.loader.present();
  

  await this.employeeService.refreshEmployeeList(pageIndex,pageSize,searchTerm);
  this.employeeService.pageIndex += 1;
    
  
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
