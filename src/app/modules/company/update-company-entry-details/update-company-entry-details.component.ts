import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { passwordValidator } from '../add-new-company/add-new-company.component';
import { UnauthorizedError, errorsEnum } from '../../../app.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-company-entry-details',
  templateUrl: './update-company-entry-details.component.html',
  styleUrl: './update-company-entry-details.component.scss'
})
export class UpdateCompanyEntryDetailsComponent {

  entryDetails: { userName: string, password: string } = { password: "", userName: "" }
  entryForm!: FormGroup
  validForm: boolean = true
  compId!: number

  constructor(private _router: Router, private _service: CompanyService, private _fb: FormBuilder,
    private _activated: ActivatedRoute) { }

  ngOnInit() {

    this._activated.params.subscribe({
      next: data => {
        let id = data['id']
        if (id) {
          this.compId = id
        }
      }
    })
    let entryStr = sessionStorage.getItem('entryDetails')
    if (entryStr) {
      let entry = JSON.parse(entryStr)
      this.entryDetails.password = entry.password
      this.entryDetails.userName = entry.userName
      sessionStorage.removeItem('entryDetails')
      this.createForm()
    }


  }

  createForm() {
    this.entryForm = this._fb.group({
      userName: [this.entryDetails.userName, Validators.required],
      password: [this.entryDetails.password, Validators.compose([Validators.required, passwordValidator])]
    })
  }

  get entryFormControls() {
    return this.entryForm.controls
  }

  saveChanges() {
    if (this.entryForm.status == 'VALID') {
      this.validForm = true
      this.entryDetails = this.entryForm.value
      this._service.updateCompanyEntryDetails(this.compId, this.entryDetails.userName, this.entryDetails.password)
        .subscribe({
          next: () => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "The changes were successfully saved",
              showConfirmButton: false,
              timer: 1500
            });
            this._router.navigate([`company/details/${this.compId}`])
          },
          error: err => {
            if (err.status == 401)
              UnauthorizedError()
            else if (err.status == 400)
              this.BadRequest()
            else if (err.status == 404)
              this.PageNotFound()
            else
              this._router.navigate(['error'])
          }
        })
    }
    else {
      this.validForm = false
    }
  }

  BadRequest() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "It's seems there is an error, Please verify the integrity of the document",
      allowOutsideClick: true,
    })
  }

  PageNotFound() {
    this._router.navigate([`error?mess=${errorsEnum.NOTFOUND}`])
  }
}



