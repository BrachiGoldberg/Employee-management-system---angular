import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { EmployeePosition, Position } from '../models/position.model.';
import { DatePipe } from '@angular/common';
import { emailValidator } from '../../company/add-new-company/add-new-company.component';

export function dateComparisonValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const birthDateControl = formGroup.get('birthDate');
    const startJobControl = formGroup.get('startJob');

    if (birthDateControl && startJobControl) {
      const birthDate = new Date(birthDateControl.value);
      const startJob = new Date(startJobControl.value);

      if (startJob < birthDate) {
        return { 'dateComparison': true };
      }
    }

    return null;
  };
}

@Component({
  selector: 'app-add-update-employee',
  templateUrl: './add-update-employee.component.html',
  styleUrl: './add-update-employee.component.scss'
})
export class AddUpdateEmployeeComponent {


  url: string | undefined
  employee: Employee = new Employee()
  employeeFrom: FormGroup | undefined
  empId: number | undefined
  isUpdateStatus: boolean = false
  isManagerAdded: boolean = false
  allPositions: Position[] = []
  empPositions: EmployeePosition[] = []
  showPositions: Position[] = []
  // ableDate: boolean = false
  posForm: FormGroup = new FormGroup({ 'date': new FormControl(new Date()) })
  position: Position = new Position()
  newPosForm: FormGroup = new FormGroup({
    "name": new FormControl(this.position.name, Validators.required),
    "isAdministrative": new FormControl(this.position.isAdministrative ? this.position.isAdministrative : false)
  })
  validForm: boolean = true
  isAbleNewPosition: boolean = false
  isAbleListPositions: boolean = false
  isShowDateField: boolean = false
  positionIdSelected: number | undefined
  validPosForm: boolean = true
  validNewPosForm: boolean = true


  constructor(private _activated: ActivatedRoute, private _router: Router,
    private _service: EmployeeService, private _fb: FormBuilder, private _datePipe: DatePipe) { }


  ngOnInit() {
    this.createForm()
    this._activated.url.subscribe(data => this.url = data[0].path)
    this.getPostionsList()

    if (this.url == "new-emp" || this.url == 'add-manager') {
      this.employee = new Employee()
      this.isUpdateStatus = false
      if (this.url == 'add-manager') {
        let identity = sessionStorage.getItem('managerId')
        if (identity)
          this.employee.identity = identity
        this.isManagerAdded = true
      }
      this.createForm()
    }
    else {
      this.isUpdateStatus = true
      this._activated.params.subscribe(params => {
        this.empId = params['id']

        if (this.empId) {
          this._service.getEmployee(this.empId).subscribe({
            next: data => {
              this.employee = data
              this.empPositions = data.positions
              console.log("why I dont see the identity property?", this.employee)
              this.initialShowPositions()
              this.createForm()
            },
            error: err => {
              console.log("there is an error: ", err)
            }
          })
        }
      })
    }

  }

  createForm() {
    this.employeeFrom = this._fb.group({
      identity: [{ value: this.employee.identity, disabled: this.isUpdateStatus || this.isManagerAdded }, Validators.required],
      lastName: [this.employee.lastName, Validators.required],
      firstName: [this.employee.firstName, Validators.required],
      address: [this.employee.address, Validators.required],
      email: [this.employee.email, Validators.compose([Validators.required, emailValidator])],
      credits: [this.employee.credits, Validators.required],
      birthDate: [{ value: this._datePipe.transform(this.employee.birthDate, 'yyyy-MM-dd'), disabled: this.isUpdateStatus },
      Validators.required],
      isMale: [{ value: this.employee.isMale, disabled: this.isUpdateStatus }, Validators.required],
      startJob: [{ value: this._datePipe.transform(this.employee.startJob, 'yyyy-MM-dd'), disabled: this.isUpdateStatus },
      Validators.required],
    })
  }




  getPositionName(id: number) {
    let pos = this.allPositions.find(p => p.id == id)
    if (pos)
      return pos.name
    return null
  }

  getPostionsList() {
    this._service.getPositions().subscribe({
      next: data => {
        console.log("I got all the position from the server", data)
        this.allPositions = data
        this.initialShowPositions()
      },
      error: err => {
        console.log("there is an error while try getting the positons list", err)
      }
    })
  }


  save() {
    if (this.employeeFrom!.status == 'VALID') {
      this.validForm = this.checksValidationDates('startJob', 'birthDate')

      if (this.validForm == true) {
        if (this.url == "new-emp") {
          this.addNewEmployee()
        }
        else if (this.url == "add-manager") {
          this.addManager()
        }
        else {
          this._service.updateEmployee(this.empId, this.employee).subscribe({
            next: data => {
              console.log("the employee updated succesfull, ", data)
              this.updatePositions()
            },
            error: err => {
              console.log("error!", err)
            }
          })
        }
      }
    }
    else {
      this.validForm = false
      console.log("no valid form",this.employeeFrom)
    }
  }

  checksValidationDates(firstDate: string, secondDate: string): boolean {
    let date
    if (firstDate == 'date')
      date = this.posForm!.get(firstDate)
    else
      date = this.employeeFrom!.get(firstDate)
    const firstDateControl = date
    const secondDateControl = this.employeeFrom!.get(secondDate)
    if (firstDateControl && secondDateControl) {
      const firstDate = new Date(firstDateControl.value)
      const secondDate = new Date(secondDateControl.value)

      if (secondDate > firstDate) {
        return false
      }
      return true
    }
    return false

  }


  updatePositions() {
    console.log("employee positions ", this.empPositions)
    this._service.updatePositions(this.empId!, this.empPositions).subscribe({
      next: data => {
        console.log("positons updates", data)
        history.back()
      },
      error: err => {
        console.log("Oops.. something want wrang", err)
      }
    })
  }

  addNewEmployee() {
    this.employee = this.employeeFrom!.value
    this.employee.positions = this.empPositions
    sessionStorage.setItem("new-emp", JSON.stringify(this.employee))
    this._router.navigate([`employee/new-emp-terms`])

  }

  addManager() {
    let id = this.employee.identity
    this.employee = this.employeeFrom!.value
    this.employee.positions = this.empPositions
    this.employee.identity = id
    sessionStorage.setItem("new-emp", JSON.stringify(this.employee))
    this._router.navigate([`employee/manager-emp-terms`])
  }

  get newPositionControlers(){
    return this.newPosForm.controls
  }
  postPosition() {
    
    this.position = this.newPosForm.value
    console.log(this.position.name, this.position.isAdministrative.valueOf(), this.allPositions)
    let exists = this.allPositions.find(p => p.name == this.position.name &&
      (p.isAdministrative && this.position.isAdministrative.valueOf() == true||
      !p.isAdministrative && this.position.isAdministrative.valueOf() == false
      ))
    if (this.newPosForm.status == 'VALID' && exists ) {
      this.validNewPosForm = false
      console.log("this positon already exists")
    }
     else {
      this.validNewPosForm = true
       console.log("its a new position to add  the server")
       this._service.addNewPosition(this.position).subscribe({
         next: data => {
           console.log(" I added new position", data)
          this.isAbleNewPosition = false
           this.getPostionsList()
           this.newPosForm.reset()
         },
         error: err => {
           console.log("there is an error post new position", err)
           this.isAbleNewPosition = false
         }
       })
     }
  }

  removeEmp() {
    this._service.removeEmployeeFromCompany(this.employee.id!).subscribe({
      next: data => {
        console.log("data worked well", data)
        this._router.navigate(['employee'])
      },
      error: err => {
        console.log("delete not worked well, something want wrang", err)
      }
    })
  }

  updateTerms() {
    this._router.navigate([`employee/update-emp-terms/${this.employee.termsId}`])
  }

  updateBankAccout() {
    this._router.navigate([`employee/update-account-b/${this.employee.bankAccountId}`])
  }


  // all this functions are related to the employee positions
  get positionFormControls() {
    return this.posForm.controls
  }

  initialShowPositions() {
    this.showPositions = this.allPositions.filter(p =>
      !this.empPositions.find(ep => ep.positionId == p.id)
    )
  }

  removePosition(index: number) {
    console.log("pos index", index)
    let posIndex = this.empPositions.findIndex(p => p.positionId == index)
    if (posIndex != -1) {
      this.empPositions.splice(posIndex, 1)
    }
    console.log("pos index", posIndex)
    this.initialShowPositions()
  }

  ableNewPosition() {
    this.isAbleNewPosition = true
  }

  changeAbleList() {
    this.isAbleListPositions = !this.isAbleListPositions
  }

  addDateField(posId: number) {
    this.isShowDateField = !this.isShowDateField
    this.positionIdSelected = posId
  }

  enableAddPosition() {
    if (this.checksValidationDates('date', 'startJob')) {
      this.validPosForm = true
      this.empPositions.push({
        positionId: this.positionIdSelected,
        startPositionDate: this.posForm.value.date,
        id: undefined,
        employeeId: undefined
      })

      this.isShowDateField = false
      this.initialShowPositions()
      this.positionIdSelected = undefined
    }
    else {
      this.validPosForm = false
    }
  }
}
