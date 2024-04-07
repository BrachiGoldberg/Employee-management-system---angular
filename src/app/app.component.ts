import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import Swal from 'sweetalert2';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

export enum errorsEnum { NOTFOUND = "notFound", BADREQUEST = "badRequest" }
export function UnauthorizedError() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "You must be logged in to your account to perform this action",
    allowOutsideClick: true,
    didClose: () => location.replace('company')
  });

}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HomeComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'employee-management-client';

  constructor(private _router: Router) { }

 
}
