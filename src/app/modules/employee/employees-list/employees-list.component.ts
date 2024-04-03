import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

  employeesList!: Employee[]
  companyId: number | undefined

  constructor(private _service: EmployeeService, private _router: Router) { }

  ngOnInit() {
    let myCompany = sessionStorage.getItem("company")
    if (myCompany) {
      this.companyId = +JSON.parse(myCompany).id
      this.getEmployees(this.companyId)
    }
  }

  getEmployees(companyId: number) {

    this._service.getAllEmployeesByCompanyId(this.companyId!).subscribe(data => {
      console.log("all employees got", data)
      this.employeesList = data
    }, reg => {
      console.log("there is an error: ", reg)
      this.employeesList = []
    })

  }

  moredetails(empId: number) {
    console.log("employee id is: ", empId)
    this._router.navigate(['employee/emp-id', empId])

  }

addNewEmployee(){
  this._router.navigateByUrl('employee/new-emp')
}

downloadCsv() {
  this._service.downloadCsv(this.companyId!).subscribe((data: Blob) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
}



companyDetails(){
  this._router.navigate([`company/details/${this.companyId}`])
}
}
