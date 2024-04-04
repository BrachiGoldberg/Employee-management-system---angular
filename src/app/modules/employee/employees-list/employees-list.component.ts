import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../models/employee.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UnauthorizedError, errorsEnum } from '../../../app.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

  employeesList!: Employee[]
  showListEmployee: Employee[] = []
  companyId: number | undefined
  searchText: string | undefined
  classDropdown: string = ""
  hoursFile: any

  constructor(private _service: EmployeeService, private _router: Router) { }

  ngOnInit() {
    let myCompany = sessionStorage.getItem("company")
    if (myCompany) {
      this.companyId = +JSON.parse(myCompany).id
      this.getEmployees(this.companyId)
    }
  }

  getEmployees(companyId: number) {

    this._service.getAllEmployeesByCompanyId(this.companyId!).subscribe({
      next: data => {
        console.log("all employees got", data)
        this.employeesList = data
        this.showListEmployee = data
      },
      error: err => {
        this.employeesList = []
        this.errosFunction(err.status)
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

  moredetails(empId: number) {
    console.log("employee id is: ", empId)
    this._router.navigate(['employee/emp-id', empId])

  }

  addNewEmployee() {
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



  companyDetails() {
    this._router.navigate([`company/details/${this.companyId}`])
  }

  changeSearch() {
    console.log("now its changed by input", this.searchText)
    this.filter()
  }
  cancel() {
    this.searchText = undefined
    this.filter()
  }

  filter() {
    this.showListEmployee = this.employeesList.filter(e =>
      this.searchText == undefined ||
      e.firstName?.toLowerCase()?.includes(this.searchText.toLowerCase()) ||
      e.lastName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      e.address?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      e.email?.toLowerCase().includes(this.searchText.toLowerCase()))

    console.log("the show list", this.showListEmployee)
  }

  showDropdown() {
    if (this.classDropdown == "")
      this.classDropdown = "show"
    else
      this.classDropdown = ""
  }

  addHours(data: any) {

    console.log("data accept: ", data)
    const file: File = data?.target?.files
    // if (file) {

    //   // this.fileName = file.name;

    //   const formData = new FormData();

    //   formData.append("thumbnail", file);
    //   console.log("form data", formData)
    // }

  }
}
