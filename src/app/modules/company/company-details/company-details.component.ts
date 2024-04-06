import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '../models/company.model';
import { UnauthorizedError } from '../../../app.component';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss'
})
export class CompanyDetailsComponent {

  company: Company | undefined
  id!: number

  constructor(private _service: CompanyService, private _router: Router, private _activated: ActivatedRoute) { }

  ngOnInit() {
    this._activated.params.subscribe({
      next: data => {
        let id = data['id']
        if (id) {
          this.id = id
          this.getCompanyDetails()
        }
      }
    })

  }


  getCompanyDetails() {
    this._service.getCompanyById(this.id).subscribe({
      next: data => {
        this.company = data
      },
      error: err => {
        if (err.status == 401)
          UnauthorizedError()
        else
          this._router.navigate(['error'])
      }
    })
  }

  updateCompany() {
    this._router.navigate([`company/update-company/${this.id}`])
  }

  updateTerms() {
    this._router.navigate([`company/comp-id/${this.id}/update-terms/${this.company!.termsId}`])
  }

  updateEntryDetails() {
    let entry = { userName: this.company?.userName, password: this.company?.password }
    sessionStorage.setItem('entryDetails', JSON.stringify(entry))
    this._router.navigate([`company/comp-id/${this.id}/update-entry-details`])
  }
}
