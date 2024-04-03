import { Component } from '@angular/core';
import { Company } from '../company.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../add-new-company/add-new-company.component';

@Component({
  selector: 'app-update-company-details',
  templateUrl: './update-company-details.component.html',
  styleUrl: './update-company-details.component.scss'
})
export class UpdateCompanyDetailsComponent {

  company: Company = new Company()
  id!: number
  updateForm!: FormGroup
  validForm: boolean = true

  constructor(private _router: Router, private _service: CompanyService, private _fb: FormBuilder,
    private _activated: ActivatedRoute) { }

  ngOnInit() {
    this.createForm()

    this._activated.params.subscribe({
      next: data => {
        let id = data['id']
        if (id) {
          this.id = id
          this.getCompany()
        }
      }
    })

  }

  getCompany() {
    this._service.getCompanyById(this.id).subscribe({
      next: data => {
        console.log("this is my data", data)
        this.company = data
        this.createForm()
      }
    })

  }

  createForm() {
    this.updateForm = this._fb.group({
      name: [this.company.name, [Validators.required]],
      description: [this.company.description, [Validators.required]],
      address: [this.company.address, [Validators.required]],
      email: [this.company.email, Validators.compose([Validators.required, emailValidator])],
    })
  }

  get updateFormControls() {
    return this.updateForm.controls
  }

  saveChanges() {

    if (this.updateForm.status == 'VALID') {
      
      this.validForm = true
      let termsId = this.company.termsId
      this.company = this.updateForm.value
      this.company.termsId = termsId
      console.log("this is the update details: ", this.company)
      this._service.updateCompany(this.id, this.company).subscribe({
        next: data => {
          console.log("update is success", data)
          this._router.navigate([`company/details/${this.id}`])
        },
        error: err => {
          console.log("there is an error", err)
        }
      })
    }
    else {
      this.validForm = false
    }
  }

  
}
