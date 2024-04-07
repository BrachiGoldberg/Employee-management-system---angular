import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { EmployeePosition, Position } from '../models/position.model.';
import { DatePipe } from '@angular/common';
import { emailValidator, identityValidator } from '../../company/add-new-company/add-new-company.component';
import { UnauthorizedError, errorsEnum } from '../../../app.component';
import Swal from 'sweetalert2';

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
  empId: number | undefined
  isUpdateStatus: boolean = false
  isManagerAdded: boolean = false

  //-------- properties to the centeral Form - Employee details --------
  employeeFrom: FormGroup | undefined
  validForm: boolean = true
  employee: Employee = new Employee()

  //-------- properties to the positions' list --------
  allPositions: Position[] = []
  showPositions: Position[] = []
  isAbleListPositions: boolean = false

  //-------- properties related to edit employee's positions --------
  empPositions: EmployeePosition[] = []
  //-------- properties related to add position to employee --------
  posForm: FormGroup | undefined
  validPosForm: boolean = true
  isAbleNewPosition: boolean = false
  isShowDateField: boolean = false
  positionIdSelected: number | undefined

  //-------- properties related to add new position --------
  position: Position = new Position()
  validNewPosForm: boolean = true

  constructor(private _activated: ActivatedRoute, private _router: Router,
    private _service: EmployeeService, private _fb: FormBuilder, private _datePipe: DatePipe) { }


  ngOnInit() {
    this.createForm()
    this.createPositionForm()

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
          this.getEmployeeById()
        }
      })
    }
  }

  //-------- create forms and validation ----------
  createForm() {
    this.employeeFrom = this._fb.group({
      identity: [{ value: this.employee.identity, disabled: this.isUpdateStatus || this.isManagerAdded }, [Validators.required, identityValidator]],
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
      positons: this._fb.array([])
    })
  }

  createPositionForm() {
    this.posForm = this._fb.group({
      date: [new Date()],
      isAdmin: [false]
    })
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

  get formControl() {
    return this.employeeFrom!.controls
  }


  //--------- function related to saving changes ---------
  save() {
    console.log(this.employeeFrom)
    if (this.employeeFrom!.status != 'INVALID') {
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
            next: () => {
              this.updatePositions()
            },
            error: err => {
              this.errosFunction(err.status)
            }
          })
        }
      }
    }
    else {
      this.validForm = false
    }
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

  updatePositions() {
    this._service.updatePositions(this.empId!, this.empPositions).subscribe({
      next: () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "The employee has been successfully update",
          showConfirmButton: false,
          timer: 1500
        });
        history.back()
      },
      error: err => {
        this.errosFunction(err.status)
      }
    })
  }

  getEmployeeById() {
    this._service.getEmployee(this.empId!).subscribe({
      next: data => {
        this.employee = data
        this.empPositions = data.positions
        this.initialShowPositions()
        this.createForm()
      },
      error: err => {
        this.errosFunction(err.status)
      }
    })
  }


  //--------- function are related to positions list --------------
  getPostionsList() {
    this._service.getPositions().subscribe({
      next: data => {
        this.allPositions = data
        this.initialShowPositions()
      },
      error: err => {
        this.errosFunction(err.status)
      }
    })
  }

  initialShowPositions() {
    this.showPositions = this.allPositions.filter(p =>
      !this.empPositions.find(ep => ep.positionId == p.id)
    )
  }

  getPositionName(id: number) {
    let pos = this.allPositions.find(p => p.id == id)
    if (pos)
      return pos.name
    return null
  }

  changeAbleList() {
    this.isAbleListPositions = !this.isAbleListPositions
  }


  //--------- function are related to employee's positions --------------
  removePosition(index: number) {
    let posIndex = this.empPositions.findIndex(p => p.positionId == index)
    if (posIndex != -1) {
      this.empPositions.splice(posIndex, 1)
    }
    this.initialShowPositions()
  }

  get positionFormControls() {
    return this.posForm!.controls
  }

  //--------- function are related to add position to the employee --------------
  addDateField(posId: number) {
    this.isShowDateField = !this.isShowDateField
    this.positionIdSelected = posId
  }

  AddPositionToEmp() {
    if (this.checksValidationDates('date', 'startJob')) {
      this.validPosForm = true
      this.empPositions.push({
        positionId: this.positionIdSelected,
        startPositionDate: this.posForm!.value.date,
        id: undefined,
        employeeId: undefined,
        isAdministrative: this.posForm!.value.isAdmin
      })

      this.isShowDateField = false
      this.initialShowPositions()
      this.positionIdSelected = undefined
    }
    else {
      this.validPosForm = false
    }
  }

  //--------- function are related to added new position --------------
  ableNewPosition() {
    this.isAbleNewPosition = true
  }

  postPosition() {
    let exists = this.allPositions.find(p => p.name?.toLowerCase() == this.position.name?.toLocaleLowerCase())
    if (exists) {
      this.validNewPosForm = false
      console.log("this positon already exists")
    }
    else {
      this.validNewPosForm = true
      this._service.addNewPosition(this.position).subscribe({
        next: () => {
          this.isAbleNewPosition = false
          this.getPostionsList()
          this.position.name = ""
        },
        error: err => {
          this.errosFunction(err.status)
          this.isAbleNewPosition = false
        }
      })
    }
  }


  //---------- Update employee functions ---------
  removeEmp() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I want remove employee!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._service.removeEmployeeFromCompany(this.employee.id!).subscribe({
          next: () => {
            Swal.fire({
              title: "Deleted!",
              text: "The employee has been deleted.",
              icon: "success"
            });
            this._router.navigate(['employee'])
          },
          error: err => {
            this.errosFunction(err.status)
          }
        })
      }
    });
  }

  updateTerms() {
    this._router.navigate([`employee/update-emp-terms/${this.employee.termsId}`])
  }

  updateBankAccout() {
    this._router.navigate([`employee/update-account-b/${this.employee.bankAccountId}`])
  }


  //--------- Error handle ----------------
  errosFunction(statusCode: number) {
    switch (statusCode) {
      case 400:
        this.badRequest()
        break
      case 401:
        UnauthorizedError()
        break
      case 404:
        this.pageNotFound()
        break
      default:
        this._router.navigate(['error'])
    }
  }

  badRequest() {
    this._router.navigate([`error?mess=${errorsEnum.BADREQUEST}`])
  }

  pageNotFound() {
    this._router.navigate([`error?mess=${errorsEnum.NOTFOUND}`])
  }

}
