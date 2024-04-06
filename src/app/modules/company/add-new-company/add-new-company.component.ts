import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Company } from '../models/company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import Swal from 'sweetalert2';
import { UnauthorizedError } from '../../../app.component';

export function emailValidator(control: AbstractControl): { [key: string]: any } | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = emailRegex.test(control.value);
  return valid ? null : { 'invalidEmail': true };
}

export function passwordValidator(control: AbstractControl): { [key: string]: any } | null {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  const valid = passwordRegex.test(control.value);
  return valid ? null : { 'invalidPassword': true };
}

export function identityValidator(control: AbstractControl): { [key: string]: any } | null {
  const passwordRegex = /^[\d]{9}$/;
  const valid = passwordRegex.test(control.value);
  return valid ? null : { 'invalidPassword': true };
}

@Component({
  selector: 'app-add-new-company',
  templateUrl: './add-new-company.component.html',
  styleUrl: './add-new-company.component.scss'
})
export class AddNewCompanyComponent {

  company!: Company
  comopanyForm!: FormGroup
  managerIdentity: string | undefined
  validForm: boolean = true
  url!: string
  companyId: number | undefined


  constructor(private _router: Router, private _service: CompanyService, private _fb: FormBuilder,
    private _activated: ActivatedRoute) { }

  ngOnInit() {
    this._activated.url.subscribe(data => this.url = data[0].path)

    if (this.url == 'new-company') {

      sessionStorage.clear()
      this.company = new Company()
      this.createForm()
    }
    else {
      this._activated.params.subscribe({
        next: data => {
          let id = data['id']
          if (id) {
            this.companyId = id
            this.getCompany()
          }
        }
      })
    }
  }

  getCompany() {
    this._service.getCompanyById(this.companyId!).subscribe({
      next: data => {
        this.company = data
        this.createForm()
      },
      error: err => {
        if (err.status == 401)
          UnauthorizedError()
        else
          this._router.navigate(['error'])
        
      }
    })
  }


  createForm() {
    this.comopanyForm = this._fb.group({
      name: [this.company.name, [Validators.required]],
      description: [this.company.description, [Validators.required]],
      address: [this.company.address, [Validators.required]],
      email: [this.company.email, Validators.compose([Validators.required, emailValidator])],
      userName: [this.company.userName, [Validators.required]],
      password: [this.company.password, [Validators.required, passwordValidator],],
      managerIdentity: [this.managerIdentity, [Validators.required, identityValidator]]
    })
  }

  get registerFormControls() {
    return this.comopanyForm.controls
  }

  register() {

    if (this.comopanyForm.status == 'VALID') {
      this.validForm = true

      this.company.name = this.comopanyForm.value.name
      this.company.description = this.comopanyForm.value.description
      this.company.address = this.comopanyForm.value.address
      this.company.email = this.comopanyForm.value.email
      this.company.userName = this.comopanyForm.value.userName
      this.company.password = this.comopanyForm.value.password
      this.managerIdentity = this.comopanyForm.value.managerIdentity
      sessionStorage.setItem('new-comp', JSON.stringify(this.company))
      sessionStorage.setItem('managerId', this.managerIdentity!.toString())
      this._router.navigate(['company/new-terms'])
    }
    else
      this.validForm = false
  }


}
