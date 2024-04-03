import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyTerms } from '../company-terms.model';
import { CompanyService } from '../company.service';
import { Company } from '../company.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-terms',
  templateUrl: './company-terms.component.html',
  styleUrl: './company-terms.component.scss'
})
export class CompanyTermsComponent {

  companyTerms: CompanyTerms = new CompanyTerms()
  termsForm!: FormGroup
  url!: string
  id: number | undefined
  compId: number | undefined
  validForm: boolean = true

  constructor(private _router: Router, private _service: CompanyService,
    private _fb: FormBuilder, private _activated: ActivatedRoute) { }

  ngOnInit() {
    this.createForm()
    this._activated.url.subscribe(data => this.url = data[0].path)

    if (this.url == "new-termss") {
      this.createForm()
    }
    else {
      this._activated.params.subscribe({
        next: data => {
          let id = data['id']
          if (id) {
            this.id = id
            this.getCompanyTerms()
          }
          let compId = data['compId']
          if (compId)
            this.compId = compId
        }
      })


    }


  }

  createForm() {
    this.termsForm = this._fb.group({
      meals: [this.companyTerms.meals],
      nightShiftPrecent: [this.companyTerms.nightShiftPrecent],
      shabbatShiftPrecent: [this.companyTerms.shabbatShiftPrecent],
      gifts: [this.companyTerms.gifts],
      clothing: [this.companyTerms.clothing],
      recovery: [this.companyTerms.recovery],
      birthDays: [this.companyTerms.birthDays],
      daySalariesCalculation: [this.companyTerms.daySalariesCalculation,
      Validators.compose([Validators.required, Validators.min(1), Validators.max(30)])]
    })
  }

  get termsControlers() {
    return this.termsForm.controls
  }
  getCompanyTerms() {
    this._service.getCompanyTermsById(this.id!).subscribe({
      next: data => {
        console.log("company terms", data)
        this.companyTerms = data
        this.createForm()
      },
      error: err => {
        console.log("I dont have company terms", err)
      }
    })
  }

  submitForm() {


    if (this.termsForm.status == 'VALID') {
      this.validForm = true
      this.companyTerms = this.termsForm.value
      console.log("terms parameters: ", this.companyTerms)

      if (this.url == "new-terms") {
        this.AddNewTerms()
      }
      else {
        this.updateTerms()
      }
    }
    else {
      this.validForm = false
    }
  }

  AddNewTerms() {
    this._service.addCompanyTerms(this.companyTerms).subscribe({
      next: data => {
        console.log("submit succededd", data)
        this.sendNewCompany(data.id!)
      },
      error: reg => {
        console.log("ERROR! ", reg)
      }
    })
  }

  sendNewCompany(termsId: number) {
    let company = sessionStorage.getItem("new-comp")
    let managerId = sessionStorage.getItem("managerId")

    if (company && managerId) {
      let myCompany: Company = JSON.parse(company)
      myCompany.manager = { companyId: 0, identity: managerId }

      this._service.addNewCompany(myCompany, termsId).subscribe({
        next: data => {
          console.log("data succeedded", data)
          console.log("now I have new Comapny, please check if it correct!")
          sessionStorage.setItem("token", data.token)
          sessionStorage.setItem("company", JSON.stringify(data.company))
          this._router.navigate(["employee/add-manager"])
        },
        error: reg => {
          console.log("ERROR!", reg)
        }
      })
    }
    else
      console.log("there is an error, please check all the details are correct")

  }

  updateTerms() {
    this._service.updateCompanyTerms(this.id!, this.companyTerms).subscribe({
      next: data => {
        console.log("thils.is my data from server", data)
        this._router.navigate([`company/details/${this.compId}`])
      }
    })
  }

}
