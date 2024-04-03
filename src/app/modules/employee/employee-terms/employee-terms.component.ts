import { Component } from '@angular/core';
import { EmployeeTerms } from '../employee-terms.model';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-terms',
  templateUrl: './employee-terms.component.html',
  styleUrl: './employee-terms.component.scss'
})
export class EmployeeTermsComponent {

  terms: EmployeeTerms = new EmployeeTerms()
  formTerms!: FormGroup
  url!: string
  termsId: number | undefined

  constructor(private _service: EmployeeService, private _fb: FormBuilder, private _router: Router
    , private _activated: ActivatedRoute) { }

  ngOnInit() {

    this._activated.url.subscribe(data => this.url = data[0].path)

    if (this.url == 'update-emp-terms') {
      this._activated.params.subscribe(data => this.termsId = data['id'])
      if (this.termsId)
        this.getTermsById()
    }

    this.createForm()
  }

  createForm() {
    this.formTerms = this._fb.group({
      hourlyWage: [this.terms.hourlyWage],
      overtimePay: [this.terms.overtimePay],
      monthlyHoursCount: [this.terms.monthlyHoursCount],
      travelExpenses: [this.terms.travelExpenses],
      sickDays: [this.terms.sickDays],
      educationFund: [this.terms.educationFund]
    })
  }

  getTermsById() {
    this._service.getEmpTermsById(this.termsId!).subscribe({
      next: data => {
        console.log("I got the employee terms from the server", data)
        this.terms = data
        this.createForm()
      },
      error: err => {
        console.log("I have an error", err)
      }
    })
  }


  save() {
    this.terms = this.formTerms.value

    if (this.url == 'update-emp-terms') {
      this.updateTerms()
    }
    else {
      this._service.addEmployeeTerms(this.terms).subscribe({
        next: data => {
          console.log("data comes for me!!!! its so fine--)", data)
          sessionStorage.setItem("empTermsId", JSON.stringify(data.id))
          if (this.url == 'manager-emp-terms')
            this._router.navigate(['employee/manager-account-b'])
          else
            this._router.navigate(['employee/new-account-b'])
        },
        error: err => {
          console.log("Oops... there is an error", err)
        }
      })
    }
  }

  updateTerms(){
    this._service.updateEmpTerms(this.termsId!, this.terms).subscribe({
      next: data => {
        console.log("terms update succeessful", data)
        history.back()
      },
      error: err => {
        console.log("I have error", err)
      }
    })
  }

}
