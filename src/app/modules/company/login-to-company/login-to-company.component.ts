import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    this._service.loginToCompany(this.password, this.userName)
      .subscribe({
        next: data => {
          let timerInterval: any
          Swal.fire({
            position: "top-end",
            title: "You've logged in successfully",
            timer: 2000,
            timerProgressBar: true,
            showCloseButton: false,
            didOpen: () => {
              const timer = Swal.getPopup()!.querySelector("b");
              timerInterval = setInterval(() => {
                timer!.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
            }
          })
          sessionStorage.setItem("token", data.token)
          sessionStorage.setItem("company", JSON.stringify(data.company))
          this._router.navigate(["employee"])

        },
        error: err => {
          if (err.status == 401)
            this.massegeLoginFails()
          else
            this._router.navigate(['error'])
        }
      })

  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  massegeLoginFails() {
    Swal.fire({
      title: "Authentication failed",
      text: "User name or password are not correct, please fix it",
      footer: "Do you not have an account? You can create a new accoutn now!",
      showCancelButton: true,
      cancelButtonText: 'Create new account'
    }).then((result) => {
      if (result.isDismissed) {
        this._router.navigate([`company/new-company`])
      } else if (result.isConfirmed)
        this.userName = this.password = ""
    })
  }
}
