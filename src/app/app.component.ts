import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';

export function UnauthorizedError(){
  location.replace('company')
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HomeComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'employee-management-client';

  constructor(private _router: Router){}
  
  logOut(){
    sessionStorage.clear()
    this._router.navigate(['company'])
  }
}
