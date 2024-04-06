import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { Position } from '../models/position.model.';
import { UnauthorizedError, errorsEnum } from '../../../app.component';
import Swal from 'sweetalert2';

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
    this.getPositionsList()

    this._activated.params.subscribe({
      next: params => {
        this.empId = params['id']
        this.getEmployeeDetails()
      }})
  }

  getEmployeeDetails() {
    this._service.getEmployee(this.empId).subscribe({
      next: data => {
        this.employee = data
      },
      error: err => {
        this.errosFunction(err.status)
      }
    })
  }

  getPositionsList() {
    this._service.getPositions().subscribe({
      next: data => {
        this.allPosition = data
      },
      error: err => {
        this.errosFunction(err.status)
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
        this._service.removeEmployeeFromCompany(this.empId).subscribe({
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
    })
    
  }

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
