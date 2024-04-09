import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { addEmployee, Employee, Territories } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService } from 'src/app/common/loader.service';
import { Territory } from 'src/app/zone/zone.model';
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
    ReactiveFormsModule,
    JsonPipe

  ],
})
export class EmployeeDetailPage implements OnInit {

  loadedEmployee: Employee;
  ViewDataFlag = false;
  public employeeForm = new FormGroup({

    empId: new FormControl(0, Validators.required),
    employeeCode: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    position: new FormControl(0, Validators.required), // Assuming position is a number
    manager: new FormControl(0, Validators.required), // Assuming manager is a number
    mobilePhone: new FormControl('', Validators.required),
    workStreet: new FormControl('', Validators.required),
    workBlock: new FormControl('', Validators.required),
    workZipCode: new FormControl('', Validators.required),
    workCity: new FormControl('', Validators.required),
    workCountryCode: new FormControl('', Validators.required),
    workStateCode: new FormControl('', Validators.required),
    active: new FormControl('', Validators.required),
    u_Pwd: new FormControl('', Validators.required)
    ,
    territories: new FormArray([])
  });


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
        this.employeeForm.patchValue({
          empId: employeeId
        })
        this.loadEmployeeDetails(employeeId);
      }
      else {
        this.loadEmployeeDetails();
      }

    });



  }

  initemployeeForm() {


    this.employeeService.getLevelList();
    this.employeeService.getCountryList();
    this.employeeService.getEmployeeList();
    this.employeeService.getTerritoryList();


    this.employeeForm.patchValue({
      workCountryCode: 'IN',
      active: 'Y'
    })
  }

  fetchStateList(event:any){
    this.employeeService.getStateList('IN');
  }

  enableFormControl(EditFlag) {

    if (EditFlag == true) {
      this.employeeForm.enable()
    }
    else {
      this.employeeForm.disable()
    }
  }

  loadEmployeeDetails(employeeId?: string) {

    if (employeeId) {


      this.employeeService.getEmployee(employeeId).pipe(catchError(error => {

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {

        if (data.responseData) {
          this.loadedEmployee = data.responseData[0];
          console.log(this.loadedEmployee.territories);

          this.employeeForm.patchValue({
            employeeCode: this.loadedEmployee.employeeCode,
            firstName: this.loadedEmployee.firstName,
            lastName: this.loadedEmployee.lastName,
            position: this.loadedEmployee.position,
            manager: this.loadedEmployee.manager,
            mobilePhone: this.loadedEmployee.mobilePhone,
            workStreet: this.loadedEmployee.workStreet,
            workBlock: this.loadedEmployee.workBlock,
            workZipCode: this.loadedEmployee.workZipCode,
            workCity: this.loadedEmployee.workCity,
            workCountryCode: this.loadedEmployee.workCountryCode,
            workStateCode: this.loadedEmployee.workStateCode,
            active: this.loadedEmployee.active,
            u_Pwd: this.loadedEmployee.u_Pwd,
            territories: this.loadedEmployee.territories,
          })
        }

      })

      this.enableFormControl(false);

    }
  }

  ChangeViewDataFlag() {

    this.ViewDataFlag = false;
    this.enableFormControl(true);

  }

  // DeleteEmployee() {


  //   const employeeId = this.loadedEmployee.empId;

  //   this.alertCtrl.create({
  //     header: 'Are you sure?',
  //     message: 'Do you really want to delete the Employee?',
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel'

  //     }, {
  //       text: 'Delete',
  //       handler: () => {

  //         this.loader.present();
  //         this.employeeService.deleteEmployee(employeeId).pipe(catchError(error => {
  //           this.loader.dismiss();

  //           this.showToast('Some error has been occured', 'danger');
  //           return throwError(() => error);

  //         })).subscribe(data => {
  //           this.loader.dismiss();

  //           if (data.errCode == 0) {
  //             this.showToast('Employee Deleted Successfully', 'secondary');
  //             this.employeeService.resetValues();
  //             this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
  //             this.router.navigate(['/employee']);

  //           }


  //         })

  //       }


  //     }
  //     ]

  //   }).then(alertElement => {

  //     alertElement.present();
  //   })

  // }

  onSubmit() {

    let FormData = { ...this.employeeForm.value }

    let value: addEmployee = {
      wrapperStandardRequest: {
        employeeCode: FormData.employeeCode,
        firstName: FormData.firstName,
        lastName: FormData.lastName,
        position: FormData.position,
        manager: FormData.manager,
        mobilePhone: FormData.mobilePhone,
        workStreet: FormData.workStreet,
        workBlock: FormData.workBlock,
        workZipCode: FormData.workZipCode,
        workCity: FormData.workCity,
        workCountryCode: FormData.workCountryCode,
        workStateCode: FormData.workStateCode,
        active: FormData.active,
        u_Pwd: FormData.u_Pwd,
        empId: FormData.empId
      },
      territories: FormData.territories as Territories[]
    }

    console.log(value);


    if (value.wrapperStandardRequest.empId == 0) {
      this.loader.present();
      this.employeeService.AddEmployee(value).pipe(catchError(error => {
        this.loader.dismiss();

        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Employee Added Successfully', 'secondary');
          this.employeeService.resetValues();
          //this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);;
          this.router.navigate(['/employee']);

        }


      })
    }
    else {

      this.loader.present();
      this.employeeService.updateEmployee(value.wrapperStandardRequest.empId, value).pipe(catchError(error => {
        this.loader.dismiss();
        this.showToast('Some error has been occured', 'danger');
        return throwError(() => error);

      })).subscribe(data => {
        this.loader.dismiss();


        if (data.errCode == 0) {
          this.showToast('Employee updated Successfully', 'secondary');
          this.employeeService.resetValues();
          //this.fetchEmployeeList(this.employeeService.pageIndex, this.employeeService.pageSize, this.employeeService.searchTerm);
          this.router.navigate(['/employee']);

        }



      })

    }


  }

  public async fetchEmployeeList(pageIndex, pageSize, searchTerm) {

    //this.loader.present();


    await this.employeeService.refreshEmployeeList(pageIndex, pageSize, searchTerm);
    this.employeeService.pageIndex += 1;


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



  // handleCheckboxChange(event: any) {
  //   this.employeeForm.controls.territories.clear()

  //   let selectedTerritories: Territory[] = event.detail.value

  //     if (!this.ViewDataFlag) {

  //       selectedTerritories.forEach(territory => {
  //         console.log(territory);
  //         this.employeeForm.controls.territories.push(new FormGroup({
  //           code: new FormControl(""),
  //           name: new FormControl(territory.description),
  //           u_TerrId: new FormControl(),
  //           u_Active: new FormControl('Y')
  //         }).patchValue({
  //           code: "",
  //           name: territory.description,
  //           u_TerrId: territory.territoryId.toString(),
  //           u_Active: "Y"
  //         }))
  //       });

  //       console.log(this.employeeForm.controls.territories.value);

  //     }

  // }
  handleCheckboxChange(event: any) {
    let selectedTerritories: Territory[] = event.detail.value;

    const territoriesArray = this.employeeForm.get('territories') as FormArray;

    if (!this.ViewDataFlag) {
      territoriesArray.clear(); // Clear existing items

      selectedTerritories.forEach(territory => {
        const territoryFormGroup = this.createTerritoryFormGroup(territory);
        territoriesArray.push(territoryFormGroup);
      });
    } else {
      //Remove unchecked territories from the FormArray
      const updatedTerritories = territoriesArray.controls.filter(control =>
        selectedTerritories.some(territory => control.value.u_TerrId === territory.territoryId.toString())
      );
      territoriesArray.controls = updatedTerritories;
      console.log('update on territory');

    }

    console.log(this.employeeForm.controls.territories.value);
  }

  public createTerritoryFormGroup(territory: Territory): FormGroup {
    return this._fb.group({
      code: [''], // Assuming 'code' is a string, adjust as needed
      name: [this.employeeForm.controls.employeeCode.value], // Set initial value to territory description
      u_TerrId: [territory.territoryId.toString()], // Convert to string if necessary
      u_Active: ['Y'] // Assuming 'u_Active' is a string with initial value 'Y'
    });
  }


  setTerritory(event: any) {
    console.log(event);
    //let territoryData: Territory = { ...event.target.value }

    // form.patchValue({
    //   code: "",
    //   name: territoryData.description,
    //   u_TerrId: territoryData.territoryId.toString(),
    //   u_Active: territoryData.inactive == 'Y' ? 'N' : 'Y'
    // })

  }

  getTerritoryName(id: string):string{
    let Tid = parseInt(id)
    return this.employeeService.territoryList.filter(i => {
       return i.territoryId == Tid
    }).map(i=>{
      return i.description
    })[0]
  }
  deleteUserTerritory(tid:string){
    this.loader.present();
    this.loadedEmployee.territories.filter(i=>{
      return i.u_TerrId == tid
    }).map(i=>{
      i.u_Active = 'N'
    })
    let data: addEmployee = {
      wrapperStandardRequest: this.loadedEmployee,
      territories: this.loadedEmployee.territories
    }
    this.employeeService.updateEmployee(this.loadedEmployee.empId, data).pipe(catchError(error => {
      this.loader.dismiss();
      this.showToast('Some error has been occured', 'danger');
      return throwError(() => error);

    })).subscribe(data => {
      this.loader.dismiss();


      if (data.errCode == 0) {
        this.showToast('Employee updated Successfully', 'secondary');
        this.employeeService.resetValues();
        this.loadEmployeeDetails(this.loadedEmployee.empId.toString())
      }
    })
    
  }

}
