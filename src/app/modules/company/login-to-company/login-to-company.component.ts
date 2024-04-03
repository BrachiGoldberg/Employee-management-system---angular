import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import { UnauthorizedError } from '../../../app.component';

@Component({
  selector: 'app-login-to-company',
  templateUrl: './login-to-company.component.html',
  styleUrl: './login-to-company.component.scss'
})
export class LoginToCompanyComponent {

  userName: string | undefined
  password: string | undefined
  passwordVisible: boolean = false;


  constructor(private _service: CompanyService, private _router: Router) { }

  ngOnInit() {
    sessionStorage.clear()
  }

  login() {
    console.log("submit function", this.userName, this.password)
    this._service.loginToCompany(this.password, this.userName)
      .subscribe({
        next: data => {
          console.log(data)
          sessionStorage.setItem("token", data.token)
          sessionStorage.setItem("company", JSON.stringify(data.company))
          this._router.navigate(["employee"])

        },
        error: err => {
          console.log("ERROR: ", err)
          // this.userName = this.password = ""
        }
      })

  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
