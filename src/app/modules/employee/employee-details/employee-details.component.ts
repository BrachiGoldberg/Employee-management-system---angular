import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { Position } from '../models/position.model.';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent {

  empId!: number
  employee: Employee | undefined
  allPosition: Position[] = []

  constructor(private _service: EmployeeService, private _router: Router, private _activated: ActivatedRoute) { }

  ngOnInit() {

    // let compId = sessionStorage.getItem('companyId')
    // if (compId != undefined) {
    //   this.companyId = +compId
    // }
    this.getPositionsList()

    this._activated.params.subscribe({
      next: params => {
        this.empId = params['id']
        console.log("id params is: ", this.empId)
        this.getEmployeeDetails()
      },
      error: err => {
        console.log("error in employee-details-component get params from url", err)
      }
    })
  }

  getEmployeeDetails() {
    this._service.getEmployee(this.empId).subscribe({
      next: data => {
        console.log("data succedded ", data)
        this.employee = data
      },
      error: reg => {
        console.log("error! ", reg)
      }
    })
  }

  getPositionsList() {
    this._service.getPositions().subscribe({
      next: data => {
        this.allPosition = data
      },
      error: err => {
        console.log("there is an error while getting the positions list", err)
      }
    })
  }

  getPositionName(id: number) {
    let pos = this.allPosition.find(p => p.id == id)
    if (pos)
      return pos.name
    return null
  }

  updateEmp() {
    this._router.navigate(['employee/update-emp-id', this.empId])
  }

  removeEmp() {
    this._service.removeEmployeeFromCompany(this.empId).subscribe({
      next: data => {
        console.log("data worked well", data)
        this._router.navigate(['employee'])
      },
      error: err => {
        console.log("delete not worked well, something want wrang", err)
      }
    })
  }


}
