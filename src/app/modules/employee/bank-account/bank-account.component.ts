import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccount } from '../models/bank-account.model';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employee.model';

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
            console.log("I got bank details", data)
            this.bankAccount = data
            this.createForm()
          },
          error: err => {
            console.log("there is an error , I couldnt get the bank details", err)
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

  get bankControllers(){
    return this.accountForm.controls
  }

  save() {
    if (this.accountForm.status == 'VALID') {
      this.validForm = true
      this.bankAccount = this.accountForm.value
      console.log("bank account details: ", this.bankAccount, this.url)
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
          console.log("added account bank to manager well done!", data)
          console.log("now I need to add the manger details, please wait...")
          this.SendNewEmployee(company.id, data.id!, termsId, employee)
        },
        error: err => {
          console.log("there is an error in created bank account", err)
        }
      })
    }
  }

  updateAccount() {
    console.log("the details updated")

    this._service.updateAccount(this.bankId!, this.bankAccount).subscribe({
      next: data => {
        console.log("the details updated", data)
        history.back()
      },
      error: err => {
        console.log("there is an error ", err)
      }
    })
  }


  SendNewEmployee(companyId: number, bankId: number, termsId: number, employee: Employee) {

    this._service.addNewEmployee(companyId, employee, termsId, bankId).subscribe({
      next: data => {
        console.log("new employee added!", data)
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
        console.log("there is an error in created new employee", err)
      }
    })
  }
}
