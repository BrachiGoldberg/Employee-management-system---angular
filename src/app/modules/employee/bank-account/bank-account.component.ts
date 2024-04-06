import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccount } from '../models/bank-account.model';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';
import { UnauthorizedError, errorsEnum } from '../../../app.component';
import Swal from 'sweetalert2';

export function numbersValidator(control: AbstractControl): { [key: string]: any } | null {
  const passwordRegex = /^[\d]{1,}$/;
  const valid = passwordRegex.test(control.value);
  return valid ? null : { 'invalidPassword': true };
}

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {

  bankAccount: BankAccount = new BankAccount()
  accountForm!: FormGroup
  url!: string
  bankId: number | undefined
  validForm: boolean = false

  constructor(private _fb: FormBuilder, private _service: EmployeeService,
    private _activated: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this._activated.url.subscribe(data => this.url = data[0].path)

    if (this.url == 'update-account-b') {
      this._activated.params.subscribe(data => this.bankId = data['id'])
      if (this.bankId)
        this._service.getBankById(this.bankId).subscribe({
          next: data => {
            this.bankAccount = data
            this.createForm()
          },
          error: err => {
            this.errosFunction(err.status)
          }
        })
    }
    this.createForm()

  }

  createForm() {
    this.accountForm = this._fb.group({
      bankNunber: [this.bankAccount.bankNunber, Validators.compose([Validators.required, numbersValidator])],
      branchNumber: [this.bankAccount.branchNumber, Validators.compose([Validators.required, numbersValidator])],
      bankAccountNumber: [this.bankAccount.bankAccountNumber, Validators.compose([Validators.required, numbersValidator])]
    })
  }

  get bankControllers() {
    return this.accountForm.controls
  }

  save() {
    if (this.accountForm.status == 'VALID') {
      this.validForm = true
      this.bankAccount = this.accountForm.value
      if (this.url == 'update-account-b')
        this.updateAccount()
      else if (this.url == "new-account-b" || "manager-account-b") {
        this.CreateNewEmpAccount()
      }
    }
    else
      this.validForm = false

  }

  sendNewCompany() {
    this._router.navigate(["comapny/terms"])
  }


  CreateNewEmpAccount() {
    let termsStr = sessionStorage.getItem("empTermsId")
    let compStr = sessionStorage.getItem("company")
    let empStr = sessionStorage.getItem("new-emp")

    if (termsStr && compStr && empStr) {

      let termsId = +termsStr
      let company = JSON.parse(compStr)
      let employee = JSON.parse(empStr)

      this._service.addBankAccount(this.bankAccount).subscribe({
        next: data => {
          this.SendNewEmployee(company.id, data.id!, termsId, employee)
        },
        error: err => {
          this.errosFunction(err.status)
        }
      })
    }
  }

  updateAccount() {
    this._service.updateAccount(this.bankId!, this.bankAccount).subscribe({
      next: () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "The bank account has been successfully update",
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


  SendNewEmployee(companyId: number, bankId: number, termsId: number, employee: Employee) {

    this._service.addNewEmployee(companyId, employee, termsId, bankId).subscribe({
      next: () => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "The employee has been successfully added",
          showConfirmButton: false,
          timer: 1500
        });
        let company = sessionStorage.getItem("company")
        let token = sessionStorage.getItem("token")
        sessionStorage.clear()
        if (company)
          sessionStorage.setItem("company", company)
        if (token)
          sessionStorage.setItem("token", token)
        this._router.navigate(["employee"])
      },
      error: err => {
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
}
